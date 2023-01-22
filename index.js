//I denne filen kobler vi oss til databasen og starter serveren

import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"
import RestaurantsDAO from "./dao/restaurantsDAO.js"
import ReviewsDAO from "./dao/reviewsDAO.js"

//Laster inn environment-variablene
dotenv.config()

// Gir tilgang til mongo-klienten fra mongoddb
const MongoClient = mongodb.MongoClient

//Porten settes:
const port = process.env.PORT || 8000

//Kobler oss til databasen og starter web-serveren
MongoClient.connect(
    process.env.RESTREVIEWS_DB_URI,
    {
        //poolSize: 50, (depricated)
        wtimeoutMS: 2500,
        //useNewUrlParse: true (depricated)
    }
    )
    .catch(err => {
        console.error(err.stack)
        process.exit(1)
    })
    .then(async client =>{
        await RestaurantsDAO.injectDB(client)
        await ReviewsDAO.injectDB(client)
        app.listen(port, () => {
            console.log(`listening on port ${port}`)
        })
    })
