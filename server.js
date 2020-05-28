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
    // // callback
    // superagent
    //     .get(`http://api.brewerydb.com/v2/beers/?key=${process.env.API_KEY}`)
    //     .then(_res => {
    //         // res.body, res.headers, res.status
    //         console.log(_res.status);
    //         res.send(_res.body);
    //     })
    //     .catch(err => {
    //         // err.message, err.response
    //         console.log(err.message);
    //     });

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

// // callback
// superagent
//     .get('/api/beers')
//     .send({ name: 'Manny', species: 'cat' }) // sends a JSON post body
//     .set('X-API-Key', 'foobar')
//     .set('accept', 'json')
//     .end((err, res) => {
//         // Calling the end function will send the request
//     });

// // promise with then/catch
// superagent.post('/api/pet').then(console.log).catch(console.error);

// // promise with async/await
// (async() => {
//     try {
//         const res = await superagent.post('/api/pet');
//         console.log(res);
//     } catch (err) {
//         console.error(err);
//     }
// })();

// Start the app by listening on the default
// Heroku port
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});