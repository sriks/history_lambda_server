var _ = require("underscore");
var engine = require("./controllers/engine.js");
var cloud = require("./controllers/cloud.js");
var push = require("./controllers/push.js");

exports.handler = function(event, context) {

  engine.fetchToday({}, function(err, result) {
    // TODO: Move this chain logic to engine
    if (err) {
      console.log(err);
      context.done();
    } else {
      console.log(result.title);
      console.log("Fetched today result. Initiating cloud procedure ...");
      cloud.uploadToS3('today.json', JSON.stringify(result), function(err, data) {

          if (err) {
              console.log("upload failed");
          } else {
              console.log("completed upload to s3");
              var pushOptions = {
                "title": result.title,
                "devices": "ios",
                "environment": "all_development"
              }
              console.log("Initiating push");
              push.sendPushNow(pushOptions, function(err, pushResult) {
                  context.done();
              });
          }
      });
    }
  });
  console.log("working...");
};
