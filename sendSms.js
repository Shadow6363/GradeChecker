// Twilio Credentials
var accountSid = '';
var authToken  = '';

var https       = require('https');
var client      = require('twilio')(accountSid, authToken);
var parseString = require('xml2js').parseString;

var options = require('./request_options');

var gradeCount = 0;
var errorCount = 0;

setInterval(function() {
  var req = https.request(options, function(res) {
    res.on('data', function(data) {
      if(res.statusCode == 200) {
        parseString(data, function(err, result) {
          var newGradeCount = parseInt(result.notifications.newGrades[0]) - 6;
          if(newGradeCount != 0 && newGradeCount != gradeCount) {
            gradeCount = newGradeCount;

            client.messages.create({
              to: "+16107430728",
              from: "+1_PUT_YOUR_TWILIO_NUMBER_HERE",
              body: "A grade has been added.",
            }, function(err, message) { });
          }
        });
      } else {
        if(errorCount == 0) {
          console.log('Request Failed');
          errorCount = errorCount + 1;
        }
      }
    });
  });
  req.end();

  req.on('error', function(e) {
    console.error(e);
  });
}, 5000);
