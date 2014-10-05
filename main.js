/*jslint node:true,vars:true */
/*global mraa */

var sleep = require('sleep');
var LED1 = 13;


var Lcd = require('lcd'),
  lcd = new Lcd({rs:27, e:65, data:[23, 26, 46, 47], cols:16, rows:2});


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//GROVE Kit Shield D6 --> GPIO6
//GROVE Kit Shield D2 --> GPIO2
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


http.listen(8080, function () {
    'use strict';
    console.log('listening on *:8080');
});


// LCD work

lcd.on('ready', function () {
  setInterval(function () {
    console.log("lcd updating");
    lcd.setCursor(0, 0);
    lcd.print(new Date().toISOString().substring(11, 19));
  }, 1000);
});


//MRAA Library was installed on the board directly through ssh session
var mraa = require("mraa");
