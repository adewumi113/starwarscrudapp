// const express = require('express')
// const bodyParser = require('body-parser')
// const app = express()
// const MongoClient = require('mongodb').MongoClient

// app.use(bodyParser.json())


// // Make sure you place body-parser before your CRUD handlers!
// // app.use(bodyParser.urlencoded({ extended: true }))


// // All your handlers here...

// // app.get('/', (req, res) => {
// //     res.sendFile(__dirname + '/index.html')
// //     // Note: __dirname is the current directory you're in. Try logging it and see what you get!
// // })

// // app.post('/quotes', (req, res) => {
// //     console.log(req.body)
// //   })

//   MongoClient.connect('mongodb+srv://adewumilanre01:6nhXLnVSapNJrped@cluster0.3ivxako.mongodb.net/test?retryWrites=true&w=majority').then(
//     client => {
//     //   console.log('Connected to Database')
//       const db = client.db('star-wars-quotes')
//       const quotesCollection = db.collection('quotes')
//       //Next, we need to set view engine to ejs. This tells Express we’re using EJS as the template engine. You need to place it before any app.use, app.get or app.post methods.
//       app.set('view engine', 'ejs')
//     //   app.use(bodyParser.urlencoded({ extended: true }))
//     //   app.use(express.static('public'))
      
//       app.put('/quotes', (req, res) => {
//         console.log(req.body)
//       })
//       app.get('/', (req, res) => {
//         db.collection('quotes')
//     .find()
//     .toArray()
//     .then(results => {
//         res.render('index.ejs', { quotes: results })
//     })
//     .catch(error => console.error(error))
//     // res.render('index.ejs', {})
//     //     // const cursor = db.collection('quotes').find()
//     //     // console.log(cursor)
//     //     res.sendFile(__dirname + '/index.html')
//         // Note: __dirname is the current directory you're in. Try logging it and see what you get!
//     })
//     //   app.post('/quotes', (req, res) => {
//     //     // console.log(req.body)
//     //   })
//       app.post('/quotes', (req, res) => {
//         quotesCollection
//           .insertOne(req.body)
//           .then(result => {
//             res.redirect('/')
//           })
//           .catch(error => console.error(error))
//       })
//       app.listen(3000, function (){
//         console.log('listen on 3000')
//     })
//     })
//     .catch(console.error)



const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;



// ========================
// Link to Database
// ========================

MongoClient.connect('mongodb+srv://adewumilanre01:6nhXLnVSapNJrped@cluster0.3ivxako.mongodb.net/test?retryWrites=true&w=majority')
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

    app.listen(3000, function () {
      console.log('Listening on port 3000');
    });
  })
  .catch(console.error);
