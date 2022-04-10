const express = require('express');
// const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const ObjectId=require('mongodb').ObjectId;
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
const res = require('express/lib/response');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 4545;

app.use(cors());
app.use(bodyParser.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.djg6r.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log(uri)
client.connect(err => {
  const eventCollection = client.db("fullStackServer").collection("serverImages");
console.log('database connected successfully')

app.get('/products',(req,res)=>{
  eventCollection.find()
  .toArray((err, items)=>{
    console.log('from database',items)
    res.send(items)
  })
})

app.post('/addProduct',(req,res)=>{
  const newEvent = req.body;
  console.log('adding new event: ', newEvent)
  eventCollection.insertOne(newEvent)
  .then(result => {
    console.log('inserted ID',result.insertedId)
    res.send(result.insertedCount>0)
  })
})

app.get('/products/:name', (req, res) => {

  eventCollection.find({ name: req.params.name })
      .toArray((err, document) => {
          res.send(document);
      })
})

app.post('/addOrder',(req,res)=>{
  const addOrder = req.body;
  console.log(addOrder)
  eventCollection.insertOne(addOrder)
  .then(result => {
    console.log('inserted ID',result.insertedId)
    res.send(result.insertedCount>0)
  }) 
})


app.get('/orders',(req,res)=>{
  const email = req.query.email;
  eventCollection.find({email:req.query.email})
  .toArray((err,result)=>{
    res.send(result)
  })
})


app.delete("/products/:id",(req,res)=>{
  console.log(req.params.id)
  eventCollection.deleteOne({_id: ObjectId(req.params.id)})
  .then(result=>{
          
    console.log(result)
})
})


  
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.post('/http://localhost:4545/products',(req,res)=>{
  res.send('Got a POST')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})