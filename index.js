const express = require('express')
const app = express() 
const cors = require('cors')
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const port = process.env.PORT ||  5500;

app.use(express.json());
app.use(cors());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qkzne.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db(`${process.env.DB_NAME}`).collection("services");
  app.get('/', (req, res) => {
    res.send('Hello World!')
   
  })
  console.log("database connected", uri);
  // perform actions on the collection object
  client.close();
});






app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})