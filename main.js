/*jslint node:true,vars:true */
/*global mraa */

var LED1 = 13;
var sleep = require('sleep');
var querystring = require('querystring');
var wit = require('node-wit');
var ACCESS_TOKEN = "47IN3P3XNWQ2IINXUIQIMKHFFOCA4APX";


function light(LED, duration) {
    'use strict';
    //light connected to D13
    // buzzer on D6
    var digital_pin_D = new mraa.Gpio(LED);
    digital_pin_D.dir(mraa.DIR_OUT);
    digital_pin_D.write(1);
    console.log("Light ON!!!");
    sleep.sleep(duration);
    digital_pin_D.write(0);
    console.log("Light OFF!!!");
}


function listen(phrase) {
  light(LED1, 1);
  console.log("Sending text to Wit.AI");
  wit.captureTextIntent(ACCESS_TOKEN, phrase, function (err, res) {
      console.log("Response from Wit for text input: ");
      if (err) console.log("Error: ", err);
      console.log(JSON.stringify(res, null, " "));
  });
  light(LED1, 1);
}

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
    'use strict';
    res.send('<h1>Hello world from Intel Edison</h1>');
});

app.get('/light', function (req, res) {
    'use strict';
    light(LED1, 1);
    res.send('lit diode for 1 second');
});


app.get('/listen', function (req, res) {
    'use strict';
    console.log("req: " + req)

    if (req.method == 'POST') {
        var body = '';
        req.on('data', function (data) {
            body += data;

            // Too much POST data, kill the connection!
            if (body.length > 1e6)
                req.connection.destroy();
        });
        req.on('end', function () {
            var post = qs.parse(body);

            // use post['blah'], etc.
            var phrase = post['phrase'];

             if (phrase != undefined) { 
                     console.log("phrase:" + phrase);
                        res.send('sent ' + phrase + ' to wit');
                } else {
                     console.log("undefined phrase");
                }
        });
    }
   
   //  listen(phrase);





    
});


http.listen(8080, function () {
    'use strict';
    console.log('listening on *:8080');
});




//MRAA Library was installed on the board directly through ssh session
var mraa = require("mraa");
