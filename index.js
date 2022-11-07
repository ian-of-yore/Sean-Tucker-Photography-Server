const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mmmt3qa.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const database = client.db("SeanTucker");
        const servicesCollection = database.collection("services");

        // sending only 3 services data to the client
        app.get('/', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query).limit(3);
            const services = await cursor.toArray();
            res.send(services);
        })

        // sending all services to the client
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        // sending one specific service details
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.send(service);
        })


    }
    finally {

    }
}
run().catch((err) => console.log(err))



app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})