//DAO = data access object

//Variabel til å lagre en referanse til databasen 
let restaurants 

//Async-method = asynchronous programming er en teknikk hvor programmet tillates å
//starte opp en potensielt langvarig operasjon samtidig som programmet er responsivt
//til andre events/operasjoner. Dette istedenfor å måtte vente på at operasjonen er 
//ferdig. Resultatet fra en async operasjon presenteres når prosessen er fullført.

//Metoden sjekker om variabelen restaurants al
export default class RestaurantsDAO{
    //injectDB er hvordan vi kobler oss mot databasen. Metoden kalles så fort som serveren starter opp.
    static async injectDB(conn){
        //hvis restaurants allerede inneholder en referanse så -> return
        //hvis ikke vil vi forsøke å koble oss opp
        if(restaurants){
            return
        }
        try{
            //Collections = sample_restaurants -> restaurants (i mongoddb atlas)
            restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection("restaurants")
        } catch (e){
            console.error(
                `Unable to establish a collection handle in restaurantsDAO: ${e}`,
            )
        }
    }

    static async getRestaurants({
        filters = null,
        page = 0,
        restaurantsPerPage = 20,

    } = {}) {
        let query 
        if(filters){
            if("name" in filters) {
                query = {$text: { $search: filters["name"] } }
            } else if ("cuisine" in filters) {
                query = {"cuisine": { $eq: filters["cuisine"] } }
            } else if ("zipcode" in filters) {
                query = {"address.zipcode": { $eq: filters["zipcode"] } }
            }
        }
        
        let cursor

        try {
            cursor = await restaurants
                .find(query)
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return { restaurantsList: [], totalNumRestaurants: 0 }
        }

        const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage = page)

        try {
            const restaurantsList = await displayCursor.toArray()
            const totalNumRestaurants =  await restaurants.countDocuments(query)
            return {restaurantsList, totalNumRestaurants}
        } catch (e) {
            console.error(
                `Unable to convert cursor to array or problem counting documents, ${e}`
            )
            return { restaurantsList: [], totalNumRestaurants: 0 }
        }
    }
}