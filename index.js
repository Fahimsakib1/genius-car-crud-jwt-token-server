const { MongoClient, ServerApiVersion } = require('mongodb');

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



app.get('/', (req, res) => {
    res.send("Genius car Server is running")
});

app.listen(port, () => {
    console.log("Genius Car Server is running on port: ", port);
})
