'use strict';
const AWS  = require('./modules/awsRekogn');
const QUALTRICS = require('./modules/sapQualtrics');
const myParser = require("body-parser");
var express = require("express");
var cors = require('cors');
var app = express();

  app.use(cors());

  // Extended capacity on JSON for image base64 strings
  app.use(myParser.json({limit: '5mb'}));
  app.use(myParser.urlencoded({limit: '5mb', extended: true}));
  app.use(myParser.text({limit: '5mb'}));

  // Parse JSON bodies (as sent by API clients)
  app.use(express.json()); 

  //End-point to analyse picture using AWS Rekognition
  app.post('/awsRekogn', function (req, res) { 
    AWS.Rekogn(req.body.image, function (error, resp) {
      if (error) {
        res.send(error);
      } else {
        var jsonResponse = JSON.stringify({"rating":resp});
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(jsonResponse);
      }
    });
  });

  //End-point to fill qualtrics surveys
  app.post('/fillSurvey', function (req, res) { 
    QUALTRICS.FillSurvey(req.body, function (error, resp) {
      if (error) {
        console.error("Error - " + error);
        res.send(error);
      } else {
        var jsonResponse = JSON.stringify({"surveyresp":resp});
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(jsonResponse);
      }
    });
  });

  var port = process.env.PORT || 30000
  app.listen(port, function () {
    console.log('Smile Rekognition listening on port ' + port);
  });