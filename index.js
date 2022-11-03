const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 5000;


//require the env variable and console the user name and password of mongodb to check if it is working well
require('dotenv').config();
console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);
console.log(process.env.ACCESS_TOKEN_SECRET);

//middle wares
app.use(cors());
app.use(express.json());

//mongodb user and password
//username: geniusCarDB
//password: Ye3AqwAl3UxNeU2q

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.axoxgat.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


//function for validate jwt token
function verifyJWT (req, res, next) {
    const authHeader = req.headers.authorization;
    console.log(authHeader);

    if(!authHeader){
        return res.status(401).send({message: "Unauthorized Access"})
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(error, decoded){
        if(error){
            return res.status(403).send({message: "Forbidden Access"})
        }

        req.decoded = decoded;
        next();
    })
}






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

        // create (Means Add) orders data on database.. Client side theke checkout.js page er order data gula backend diye database e send kora. ==> Create operation
        app.post('/orders', verifyJWT, async (req, res) => {
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
        app.get('/orders', verifyJWT, async(req, res) => {
            console.log(req.query.email);
            
            //console.log(req.headers.authorization);

            const decoded = req.decoded;
            console.log(" Decoded inside Orders get API", decoded);

            if(decoded.email !== req.query.email){
                return res.status(403).send({message: "Forbidden Access"})
            }
            

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
        app.delete('/orders/:id', verifyJWT , async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await orderCollection.deleteOne(query);
            res.send(result);
        })

        // update an order status from client side. Mane orders page er moddhe j order gula ache shei gular status ta change korbo.. Processing and approved ei vabe show korbe.. ==> Delete operation
        app.patch('/orders/:id', verifyJWT, async(req, res) => {
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


        //code for jwt token
        app.post('/jwt', async(req, res) => {
            const user = req.body;
            console.log("User From Sever side: ", user);
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '5h'} );
            res.send({token})
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
