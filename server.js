

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config({path: './config/.env'})
const MongoClient = require('mongodb').MongoClient;



// ========================
// Link to Database
// ========================

MongoClient.connect(process.env.DB_STRING)
  .then(client => {
    const db = client.db('star-wars-quotes');
    const quotesCollection = db.collection('quotes');

    // ========================
    // Middlewares
    // ========================


    app.set('view engine', 'ejs');
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json()); 
    app.use(express.static('public'))

    // ========================
    // Routes
    // ========================

    app.get('/', (req, res) => {
        db.collection('quotes').find().toArray()
          .then(quotes => {
            res.render('index.ejs', { quotes: quotes })
          })
          .catch(/* ... */)
      })


      app.post('/quotes', (req, res) => {
        quotesCollection
          .insertOne(req.body)
          .then(result => {
            res.redirect('/');
          })
          .catch(error => console.error(error));
      });


    app.put('/quotes', (req, res) => {
        quotesCollection
        .findOneAndUpdate(
            { name: 'Yoda' },
            {
            $set: {
                name: req.body.name,
                quote: req.body.quote,
            }
            },
            {
            upsert: true,
            }
        )
        .then(result => {
            res.json('Success')
        })
        .catch(error => console.error(error));
    });

    

    app.delete('/quotes', (req, res) => {
        quotesCollection
          .deleteOne({ name: req.body.name })
          .then(result => {
            if (result.deletedCount === 0) {
              return res.json('No quote to delete')
            }
            res.json(`Deleted Darth Vader's quote`)
          })
          .catch(error => console.error(error))
      });

    app.listen(process.env.PORT, function () {
      console.log('Listening on port 3000');
    });
  })
  .catch(console.error);
