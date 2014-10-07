/*
    Author: Ivan Smirnov, isgsmirnov@gmail.com (http://ivansmirnov.name) 
    
*/


// ======================== START VARIABLES ============================ // 

// Nodejs includes
var sleep = require('sleep');
var querystring = require('querystring');
var url = require("url");
var wit = require('node-wit');
var express = require('express');
var bodyParser = require('body-parser')
var mraa = require("mraa");

// Wit.AI Access token
var ACCESS_TOKEN = "47IN3P3XNWQ2IINXUIQIMKHFFOCA4APX";

// Various power relays
var MUSIC_RELAY = 4;
var LIGHT_RELAY = 5;

// Debug lights
var LED1 = 13;

// Server port.
var PORT = 80;


// ======================== END VARIABLES ============================ // 





// Helper function, does debug lighting.
function light(LED, duration) {
    'use strict';
    var digital_pin_D = new mraa.Gpio(LED);
    digital_pin_D.dir(mraa.DIR_OUT);
    digital_pin_D.write(1);
    console.log("Light ON!!!");
    sleep.sleep(duration);
    digital_pin_D.write(0);
    console.log("Light OFF!!!");
}

// Process phrase with wit.ai
function listen(phrase) {
  light(LED1, 1);
  console.log('Sending phrase: "'+ phrase +'" to Wit.AI');
  wit.captureTextIntent(ACCESS_TOKEN, phrase, function (err, res) {
      //console.log("Response from Wit for text input: ");
      if (err) {
        console.log("Wit.AI error: ", err);
      } else {
          console.log(JSON.stringify(res, null, " "));
          processWit(res);
      }
  });
  light(LED1, 1);
}


/* Called when wit data is back. */
function processWit(response) {

    console.log("process wit called")

    // find max confidence, use that intent.
    var maxConf = 0;
    var bestIntent = "";
    for (i = 0; i < response['outcomes'].length; i++) {
        var outcome = response['outcomes'][i];
        var intent = outcome['intent'];
        var confidence = outcome['confidence'];
        if (confidence > maxConf) {
            var maxConf = confidence;
            var bestIntent = intent;
        }
    }
    
    // debug
    console.log("intent: %s, confidence: %s", bestIntent, maxConf);
    
    // Decide what to do
    switch (bestIntent) {
        case "music_on":
            // Enable relay that does music
            console.log("enabling music relay");
            var digital_pin = new mraa.Gpio(MUSIC_RELAY);
            digital_pin.dir(mraa.DIR_OUT);
            digital_pin.write(1);   
            break;  
        case "music_off":
            // Enable relay that does music
            console.log("disabling music relay");
            var digital_pin = new mraa.Gpio(MUSIC_RELAY);
            digital_pin.dir(mraa.DIR_OUT);
            digital_pin.write(0);   
            break;   
           
        case "light_on":
            // Enable relay that does lights
            console.log("disabling lights relay");
            var digital_pin = new mraa.Gpio(LIGHT_RELAY);
            digital_pin.dir(mraa.DIR_OUT);
            digital_pin.write(0);   
            break;   
            
        case "light_off":
            // Enable relay that does lights
            console.log("disabling lights relay");
            var digital_pin = new mraa.Gpio(LIGHT_RELAY);
            digital_pin.dir(mraa.DIR_OUT);
            digital_pin.write(0);   
            break;   
        
    }

}




// Create the app
var app = express();
app.use(bodyParser.json())
var http = require('http').Server(app);

// Declare endpoints
app.get('/', function (req, res) {
    'use strict';
    res.send("<h1>Welcome to Ivan's home automation system!</h1><h3>Check out the /light (GET) and /listen (POST, json phrase:words) endpoints.</h3>");
});

app.get('/light', function (req, res) {
    'use strict';
    light(LED1, 1);
    res.send('lit diode for 1 second');
});

app.post('/listen', function (req, res) {
    'use strict';

    console.log("req.body %j", req.body);
    var phrase = req.body['phrase'];
    if (phrase == undefined) { 
        console.log("undefined phrase for query %j", req.body);
        res.send('Error parsing phrase');
    } else {
        console.log("phrase:" + phrase);
        listen(phrase); 
    } 
});

// Start the server
http.listen(PORT, function () {
    'use strict';
    console.log('listening on *:%d', PORT);
});


