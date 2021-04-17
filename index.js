const express = require('express')
const app = express()
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const ObjectID = require('mongodb').ObjectID
const port = process.env.PORT || 5500;

app.use(express.json());
app.use(cors());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qkzne.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db(`${process.env.DB_NAME}`).collection("services");
  const adminCollection = client.db(`${process.env.DB_NAME}`).collection("adminInfo");
  const orderCollection = client.db(`${process.env.DB_NAME}`).collection("bookingDetails");
  const reviewCollection = client.db(`${process.env.DB_NAME}`).collection("serviceReview");


  app.post('/addAdmin', (req, res) => {
    const adminInfo = req.body;
    console.log(adminInfo);
    adminCollection.insertOne(adminInfo)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })
  app.post('/addService', (req, res) => {
    const serviceInfo = req.body;
    serviceCollection.insertOne(serviceInfo)
      .then(result => {
        res.send(result.insertedCount > 0)
        console.log(result);
      })
  })
  app.post('/serviceBooking', (req, res) => {
    const bookingData = req.body;
    console.log(bookingData);
  })

  app.get('/services', (req, res) => {
    serviceCollection.find({})
      .toArray((error, documents) => {
        res.send(documents)
      })
  })

  app.post('/order&paymentDetails', (req, res) => {
    const orderDetails = req.body;
    orderCollection.insertOne(orderDetails)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.post('/getReview', (req, res) => {
    const review = req.body;
    reviewCollection.insertOne(review)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })


  app.post('/adminAccess', (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email })
      .toArray((error, admin) => {
        res.send(admin.length > 0)
      }) 
  })

  app.get('/bookingService/:id', (req, res) => {
    serviceCollection.find({ _id: ObjectID(req.params.id) })
      .toArray((error, data) => {
        res.send(data)
      })
  })


  app.get('/reviews', (req, res) => {
    reviewCollection.find({})
      .toArray((error, data) => {
        res.send(data)
      })
  })


  app.get('/allOrder', (req, res) => {
    orderCollection.find({})
      .toArray((error, data) => {
        res.send(data)
      })
  })

  app.get('/bookingListById/:email', (req, res) => {
    orderCollection.find({ userEmail: req.params.email })
      .toArray((error, data) => {
        res.send(data)
      })
  })


  app.delete('/deleteService/:id', (req, res) => {
    serviceCollection.deleteOne({ _id: ObjectID(req.params.id) })
      .then(result => {
        res.send(result.deletedCount > 0)
      })
  })

  app.patch('/statusUpdateById/:id', (req, res) => {
    orderCollection.updateOne({ _id: ObjectID(req.params.id) },
      {
        $set: { orderStatus: req.body.inputStatus }
      })
      .then(result => {
        res.send(result.modifiedCount > 0)
      })
  })

});

app.get('/', (req, res) => {
  res.send('hi boss, i am internet service website database API (AK.email)')
})




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})