const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

//require the env variable and console the user name and password of mongodb to check if it is working well
require('dotenv').config();
console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);

//middle wares
app.use(cors());
app.use(express.json());

//mongodb user and password
//username: geniusCarDB
//password: Ye3AqwAl3UxNeU2q

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.axoxgat.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('geniusCar').collection('services');

        const orderCollection = client.db('geniusCar').collection('orders');

        
        
        //get all the services data from mongodb database server ==> Read Operation
        app.get('/services', async(req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        //find a specific service data from mongodb server ==> Read Operation
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })


        
        
        
        // Client side er orders er jonno API create//

        // create orders data on database.. Client side theke checkout.js page er order data gula backend diye database e send kora. ==> Create operation
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        })

        // get all orders data from mongodb database ==> Read operation
        // app.get('/orders', async(req, res) => {
        //     const query = {};
        //     const cursor = orderCollection.find(query);
        //     const orders = await cursor.toArray();
        //     res.send(orders);
        // })



        // get an email specific order data from mongodb database ==> Read operation
        app.get('/orders', async(req, res) => {
            console.log(req.query.email);
            let query = {};
            
            if(req.query.email){
                query={
                    email: req.query.email
                }
            }

            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
        })

        // delete an order data from mongodb database and also from client side ==> Delete operation
        app.delete('/orders/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await orderCollection.deleteOne(query);
            res.send(result);
        })

        // update an order status from client side. Mane orders page er moddhe j order gula ache shei gular staus ta change korbo.. Processing and approved ei vabe show korbe.. ==> Delete operation
        app.patch('/orders/:id', async(req, res) => {
            const id = req.params.id;
            const status = req.body.status;
            const query = {_id: ObjectId(id)};
            const updatedDoc = {
                $set: {
                    status: status
                }
            } 
            const result = await orderCollection.updateOne(query, updatedDoc);
            res.send(result);

        })


    }

    finally {

    }
}
run().catch(error => console.log(error))


app.get('/', (req, res) => {
    res.send("Genius car Server is running")
});

app.listen(port, () => {
    console.log("Genius Car Server is running on port: ", port);
})
