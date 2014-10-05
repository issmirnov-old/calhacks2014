  var wit = require('node-wit');
  var fs = require('fs');
  var ACCESS_TOKEN = "47IN3P3XNWQ2IINXUIQIMKHFFOCA4APX";

  console.log("Sending text & audio to Wit.AI");

  wit.captureTextIntent(ACCESS_TOKEN, "Hello world", function (err, res) {
      console.log("Response from Wit for text input: ");
      if (err) console.log("Error: ", err);
      console.log(JSON.stringify(res, null, " "));
  });



  console.log("catching audio");
  var stream = fs.createReadStream('sample.wav');
  wit.captureSpeechIntent(ACCESS_TOKEN, stream, "audio/wav", function (err, res) {
      console.log("Response from Wit for audio stream: ");
      if (err) console.log("Error: ", err);
      console.log(JSON.stringify(res, null, " "));
  });
