const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const OpenWeatherMapHelper = require("openweathermap-node");

const helper = new OpenWeatherMapHelper({
  APPID: '9bfb6ba731b046716b4b801600c75b18',
  units: "metric"
});

const app = express();

app.set('port', process.env.PORT || 5000);

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json());

app.post('/dialogflow', function(req, res) {
  if (req.body.queryResult &&
    req.body.queryResult.parameters &&
    req.body.queryResult.parameters.geoCountry) {
    return res.json({
      fulfillmentText: "Which city in " + req.body.queryResult.parameters.geoCountry + "?",
    });
  } else if (req.body.queryResult &&
    req.body.queryResult.parameters &&
    req.body.queryResult.parameters.geoCity) {
    helper.getCurrentWeatherByCityName(req.body.queryResult.parameters.geoCity, (err, currentWeather) => {
      if (err) {
        console.log(err);
      } else {
        const weatherAndTempreature = "The weather in " + currentWeather.name + " is " + currentWeather.weather[0].description + " and the tempreature is " + Math.ceil(currentWeather.main.temp) + "°C";
        return res.json({
          fulfillmentText: weatherAndTempreature
        });
      }
    });

  } else if (req.body.queryResult &&
    req.body.queryResult.parameters &&
    req.body.queryResult.parameters.Latitude &&
    req.body.queryResult.parameters.Longitude) {
    helper.units= "metric";
    helper.getCurrentWeatherByGeoCoordinates(req.body.queryResult.parameters.Latitude, req.body.queryResult.parameters.Longitude, (err, currentWeather) => {
      if (err) {
        console.log(err);
      } else {
        const weatherAndTempreature = "The weather in " + currentWeather.name + " is " + currentWeather.weather[0].description + " and the tempreature is " + Math.ceil(currentWeather.main.temp-272.15) + "°C";

        return res.json({
          fulfillmentText: weatherAndTempreature
        });
      }
    });
  } else if (req.body.queryResult &&
    req.body.queryResult.parameters &&
    req.body.originalDetectIntentRequest.payload.data.postback.data.lat &&
    req.body.originalDetectIntentRequest.payload.data.postback.data.long) {
      helper.units= "metric";
    helper.getCurrentWeatherByGeoCoordinates(req.body.originalDetectIntentRequest.payload.data.postback.data.lat, req.body.originalDetectIntentRequest.payload.data.postback.data.long, (err, currentWeather) => {
      if (err) {
        console.log(err);
      } else {
        const weatherAndTempreature = "The weather in " + currentWeather.name + " is " + currentWeather.weather[0].description + " and the tempreature is " + Math.ceil(currentWeather.main.temp-272.15) + "°C";

        return res.json({
          fulfillmentText: weatherAndTempreature
        });
      }
    });
  }
  else {


    return res.json({
      fulfillmentText: "Please enter correct city or Latitude & Longitude",
    });
  }
});

app.listen(app.get('port'), function() {
  console.log("running: port")
});
