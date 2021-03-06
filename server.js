// server.js
const express = require("express");
const app = express();
const path = require("path");
const superagent = require("superagent");

// Add CORS
var cors = require("cors");
app.use(cors());

// Run the app by serving the static files
// in the dist directory
app.use(express.static(__dirname + "/dist"));

// For all GET requests, send back index.html
// so that PathLocationStrategy can be used
app.get("/", function (req, res) {
  console.log("defg");
  res.sendFile(path.join(__dirname + "/dist/index.html"));
});

const breweryDBURL = "http://api.brewerydb.com/v2";
//const breweryDBURL = "http://sandbox-api.brewerydb.com/v2";

app.get("/get-random-beer", function (req, res) {
  (async () => {
    try {
      const _res = await superagent.get(
        `${breweryDBURL}/beer/random?key=${process.env.API_KEY}&withSocialAccounts=Y&withBreweries=Y`
      );
      console.log(_res.body);
      res.send(_res.body);
    } catch (err) {
      console.error(err);
    }
  })();
});

app.get("/get-upcoming-events", function (req, res) {
  (async () => {
    try {
      const _res = await superagent.get(
        `${breweryDBURL}/events/?key=${process.env.API_KEY}&order=startDate`
      );
      console.log(_res.body);
      res.send(_res.body);
    } catch (err) {
      console.error(err);
    }
  })();
});
app.get("/get-beers", function (req, res) {
  (async () => {
    try {
      const _res = await superagent.get(
        `${breweryDBURL}/beers/?key=${process.env.API_KEY}`
      );
      console.log(_res.body);
      res.send(_res.body);
    } catch (err) {
      console.error(err);
    }
  })();
});

app.get("/get-breweries", function (req, res) {
  (async () => {
    try {
      const _res = await superagent.get(
        `${breweryDBURL}/breweries/?key=${process.env.API_KEY}`
      );
      console.log(_res.body);
      res.send(_res.body);
    } catch (err) {
      console.error(err);
    }
  })();
});

// Find breweries in a certain radius of a loaction
app.get("/get-breweriesClose", function (req, res) {
  (async () => {
    try {
      lat = req.query.Latitude;
      long = req.query.Longitude;

      const _res = await superagent.get(
        `${breweryDBURL}/search/geo/point/?lat=${lat}&lng=${long}&radius=10&key=${process.env.API_KEY}`
      );
      console.log(_res.body);
      res.send(_res.body);
    } catch (err) {
      console.error(err);
    }
  })();
});

// Find breweries based on a keyword search
app.get("/get-breweriesKeyword", function (req, res) {
  (async () => {
    try {
      query = req.query.query;
      const _res = await superagent.get(
        `${breweryDBURL}/search/?q=${query}&type=brewery&withLocations=Y&withBreweries=Y&key=${process.env.API_KEY}`
      );
      console.log(_res.body);
      res.send(_res.body);
    } catch (err) {
      console.error(err);
    }
  })();
});

// Find brewery location based on brewery ID
app.get("/get-breweryLocation", function (req, res) {
  (async () => {
    try {
      query = req.query.query;
      const _res = await superagent.get(
        `${breweryDBURL}/brewery/${query}/locations/?key=${process.env.API_KEY}`
      );
      console.log(_res.body);
      res.send(_res.body);
    } catch (err) {
      console.error(err);
      res.send(false);
    }
  })();
});

// Find breweries based on on a keyword search
app.get("/get-beersKeyword", function (req, res) {
  (async () => {
    try {
      query = req.query.query;
      const _res = await superagent.get(
        `${breweryDBURL}/search/?q=${query}&type=beer&withLocations=Y&withBreweries=Y&key=${process.env.API_KEY}`
      );
      console.log(_res.body);
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
