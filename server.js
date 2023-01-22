//importer (ES6)
import express from "express"
import cors from "cors"
import restaurants from "./api/restaurants.route.js"

//Opprette express apppen - bruker vi til å lage server
const app = express()

//Tingene express skal bruke (middleware)
app.use(cors())
// express.json = Serveren kan akseptere json i "the body of a request"
app.use(express.json())

//Spesifisere routes med standard lokasjon
app.use("/api/v1/restaurants", restaurants)
// * = wildcard. Fanger tilfeller hvor noen prøver å gå til en  route som ikke eksisterer
app.use("*", (req, res) => res.status(404).json({ error: "not found"}))

//exportere app som en modul

export default app