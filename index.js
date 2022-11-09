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
        const reviewsCollection = database.collection("reviews");

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

        // inserting user provided service to servicesCollection
        app.post('/services', async (req, res) => {
            const doc = req.body;
            const result = await servicesCollection.insertOne(doc);
            res.send(result);
        })

        // Inserting user provided reviews to the reviewsCollection
        app.post('/reviews', async (req, res) => {
            const doc = req.body;
            const result = await reviewsCollection.insertOne(doc);
            res.send(result);
        })

        // sending the reviews based on serviceID
        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { serviceId: id };
            const cursor = reviewsCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        // sending reviews based on user provided email query
        app.get('/reviews', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    userEmail: req.query.email
                }
            }
            const cursor = reviewsCollection.find(query);
            const userReviews = await cursor.toArray();
            res.send(userReviews);
        })

        // deleting user provided review from the database
        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewsCollection.deleteOne(query);
            res.send(result);
        })



    }
    finally {

    }
}
run().catch((err) => console.log(err))



app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})