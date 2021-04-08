const express = require('express')
const bodyParser = require('body-parser')
const cors= require('cors')

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;


require('dotenv').config()
const app = express()
const port = process.env.PORT||5050;
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send(" WORKING");
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xzr4t.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const BookCollection = client.db("Bookshop").collection("books");
  const orderCollection = client.db("Bookshop").collection("orders");
  console.log('database connected')


    app.get('/books', (req, res) => {
      BookCollection.find()
      .toArray((err, items) => {
          res.send(items)
      })
    })

    app.post('/addBook', (req, res) => {

      const newBook = req.body;
    
      BookCollection.insertOne(newBook)
      .then(result => {
          res.send(result.insertedCount > 0)
      })
    })
    
    
    app.post('/orderedBooks', (req, res) => {
      const newOrder = req.body;
      orderCollection.insertOne(newOrder)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
    })
    
    
    app.get('/getOrders', (req, res) => {
      orderCollection.find({email: req.query.email})
      .toArray((err, documents) => {
        res.send(documents);
      })
    })
    
    app.delete('/deleteBook/:id', (req, res) => {
      const id = ObjectID(req.params.id);
      BookCollection.findOneAndDelete({_id: id})
      .then(documents => {res.send(!!documents.value)})
    })
    
})


  
//   client.close();

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})