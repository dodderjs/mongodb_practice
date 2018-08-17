const express = require('express');
const cons = require('consolidate');
const crypto = require('crypto')
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
var app = express();

// assign the swig engine to .html files
app.engine('html', cons.mustache);
 
// set .html as the default extension
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true }));

// Handler for internal server errors
function errorHandler(err, req, res, next) {
    console.error(err.message);
    console.error(err.stack);
    res.status(500).render('error_template', { error: err });
}

MongoClient.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}`, (err, client) => {
    if(err) throw err;

    const db = client.db('m101');

    app.get('/', function(req, res){
        res.render('index', {
            title: 'Dodder mongodb practice'
        });
    });

    app.get('/hw1_1', function(req, res){
        db.collection('hw1_1').find({}).toArray().then((docs) => {
            console.log(docs);
            res.render('hw', {
                title: 'Docs',
                answer: docs[0] && docs[0].answer
            });
        })
    });

    app.get('/hw1_2', function(req, res){
        db.collection('hw1_2').find({}).toArray().then((docs) => {
            let doc = docs[0];
            let algorithm = 'aes256';
            let encrypted_message = '7013254dca77e2c913d18cf5b70e7bba';
            let decipher = crypto.createDecipher(algorithm, doc['_id']);
            let decrypted = decipher.update(encrypted_message, 'hex', 'utf8') + decipher.final('utf8');
            console.log("Answer: " + decrypted);

            res.render('hw', {
                answer: decrypted
            });
        })
    });

    app.get('/hw1_3', function(req, res){
        db.collection('hw1_3').find({}).toArray().then((docs) => {
            if (docs.length < 1) {
                console.dir("No documents found. Did you forget to mongorestore?");
                return res.send("No documents found. Did you forget to mongorestore?");
            }

            let doc = docs[0];
            let algorithm = 'aes256';
            let encrypted_message = "f36731a12e6130f0ed0bccbfd9bd6ebd";
            let decipher = crypto.createDecipher(algorithm, doc['_id']);
            let decrypted = decipher.update(encrypted_message, 'hex', 'utf8') + decipher.final('utf8');
            console.log("Answer: " + decrypted);

            res.render('hw', {
                answer: decrypted
            });
        });
    });
    
    app.get('/movies', function(req, res, next) {
        db.collection('movies').find({}).toArray().then((docs) => {
            res.render('movies.html', {
                movies: docs
            });
            
        })
    });
    
    app.post('/movies/add', function(req, res, next) {
        var title = req.body.title;
        var year = req.body.year;
        var imdb = req.body.imdb;
        
        if ((title == '') || (year == '') || (imdb == '')) {
            next('Please provide an entry for all fields.');
        } else {
            db.collection('movies').insertOne(
                { 'title': title, 'year': year, 'imdb': imdb },
                function (err, r) {
                    res.render('movies',"Document inserted with _id: " + r.insertedId);
                }
            );
        }
    });
    
    app.use(errorHandler);

    var server = app.listen(process.env.NODE_ENV_PORT, () => {
        console.log(`Express server listening on port ${server.address().port}`);
    });
})