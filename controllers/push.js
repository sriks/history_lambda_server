var UrbanAirshipPush = require('urban-airship-push');
var config = {
    key: process.env.UA_PUSH_KEY,
    secret: process.env.UA_PUSH_SECRET,
    masterSecret: process.env.UA_PUSH_MASTER
};
var UAPush = new UrbanAirshipPush(config);

/*
Supported keys in options
title: The push title
environment: all_development or all_production
devices: ios or android
extra: a free form dictionary
*/
var sendPushNow = function(options, cb) {
  var pushObject = pushObjectForOptions(options);
  console.log("sending push "+JSON.stringify(pushObject));
  UAPush.push.send(pushObject, function (err, data) {
    if (err) {
        console.log("Push error "+err);
    }
    console.log(data);
    cb(err, data);
  });
};

var pushObjectForOptions = function(options) {
  var pushObject =
  {
      "audience" : {
          "tag" : options.environment
      },
      "device_types": [options.devices],
      "notification": {
	       "alert": options.title,
      }
  };
  return pushObject;
};

module.exports = {
  sendPushNow : sendPushNow
};
