// server.js
const express = require('express');
const app = express();
const path = require('path');
const superagent = require('superagent');

// Add CORS
var cors = require('cors')
app.use(cors())

// Run the app by serving the static files
// in the dist directory
app.use(express.static(__dirname + '/dist'));

// // If an incoming request uses
// // a protocol other than HTTPS,
// // redirect that request to the
// // same url but with HTTPS
// const forceSSL = function() {
//     return function(req, res, next) {
//         if (req.headers['x-forwarded-proto'] !== 'https') {
//             return res.redirect(
//                 ['https://', req.get('Host'), req.url].join('')
//             );
//         }
//         next();
//     }
// }

// // Instruct the app
// // to use the forceSSL
// // middleware
// app.use(forceSSL());

// For all GET requests, send back index.html
// so that PathLocationStrategy can be used
app.get('/', function(req, res) {
    console.log("defg");
    res.sendFile(path.join(__dirname + '/dist/index.html'));
});

app.get('/get-beers', function(req, res) {
    // promise with async/await
    (async() => {
        try {
            // const _res = await superagent.get(`http://api.brewerydb.com/v2/beers/?key=${process.env.API_KEY}`);
            const _res = await superagent.get(`http://sandbox-api.brewerydb.com/v2/beers/?key=72ecc65c3433b5fb3b6e7ea793910c51`);
            console.log(_res.status);
            res.send(_res.body);
        } catch (err) {
            console.error(err);
        }
    })();
});

app.get('/get-breweriesClose', function(req, res) {
    (async() => {
        try {
            lat = req.query.Latitude;
            long = req.query.Longitude;
            
            const _res = await superagent.get(`http://sandbox-api.brewerydb.com/v2/search/geo/point/?lat=${lat}&lng=${long}&radius=100&key=72ecc65c3433b5fb3b6e7ea793910c51`);
            console.log(_res.status);
            res.send(_res.body);
        } catch (err) {
            console.error(err);
        }
    })();
});


// Start the app by listening on the default
// Heroku port
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});