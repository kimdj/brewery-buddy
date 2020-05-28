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
    res.sendFile(path.join(__dirname + '/dist/index.html'));
});

app.get('/get-beers', function(req, res) {
    // promise with async/await
    (async() => {
        try {
            const _res = await superagent.get(`http://api.brewerydb.com/v2/beers/?key=${process.env.API_KEY}`);
            console.log(_res.status);
            res.send(_res.body);
        } catch (err) {
            console.error(err);
        }
    })();
});

app.get('/get-breweries', function(req, res) {
    (async() => {
        try {
            const _res = await superagent.get(`http://api.brewerydb.com/v2/search/geo/point?lat=35.772096&lng=-78.638614?key=28ee4c03a50f079cc0e8656be8e5a391`);
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