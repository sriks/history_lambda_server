/**
The logic to fetch content, save to S3 and send notification.
**/

var _ = require("underscore");
var test = require('./test');
var engine = require("./engine.js");
var entities = require('./entities');
var cloud = require("./cloud.js");
var push = require("./push.js");

var fetchToday = function(event, context, cb) {
  var args = context;
  if (_.has(args, 'testing') && args.testing) {
    var toTest = args.test;
    test.test(toTest, function() {
      cb();
    });
    return;
  }

  // TODO: Use promises.
  fetchTodayContent({}, function(err, content) {
    if (err) {
      cb(err);
    }

    fetchEntities(content["content"], function(err, entities) {
        if (entities) {
          content["entities"] = entities;
        }

        uploadToS3(content, function(err, S3Response) {
          if (err) {
            cb(err)
          }

          sendPushNow(content["title"], function(err, pushResponse) {
            cb(err);
          });

        }); // uploadToS3

    }); // fetchEntities

  }); // fetchTodayContent
}

var fetchTodayContent = function(options, cb) {
  console.log('Fetching content ...');
  engine.fetchToday(options, function(err, result) {
    if (err) {console.error(err);}
    else {console.log("OK");}
    cb(err, result);
  });
}

var fetchEntities = function(content, cb) {
  console.log('Fetching entities ...');
  entities.fetchEntities(content, function(err, entities) {
    if (err) {console.error(err);}
    else {console.log("OK"); console.log(JSON.stringify(entities))}
    cb(err, entities);
  });
}

var uploadToS3 = function(jsonToUpload, cb) {
  console.log('Uploading to S3 ...');
  console.log(JSON.stringify(jsonToUpload));
  cloud.uploadToS3('today.json', JSON.stringify(jsonToUpload), function(err, data) {
    if (err) {console.error(err);}
    else {console.log("OK");}
    cb(err, data);
  });
}

var sendPushNow = function(title, cb) {
  console.log('Sending push now ...');
  var pushOptions = {
    "title": title,
    "devices": "ios",
    "environment": "all_development"
  }
  push.sendPushNow(pushOptions, function(err, pushResult) {
    if (err) {console.error(err);}
    else {console.log("OK");}
    cb(err, pushResult);
  });
}

module.exports = {
  fetchToday: fetchToday
};
