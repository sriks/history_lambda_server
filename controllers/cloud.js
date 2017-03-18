var AWS = require('aws-sdk');
var S3 = new AWS.S3(); // keys are configured from AWS Lambda Role 

var uploadToS3 = function(fileName, json, cb) {
  var params = {
      Bucket: 'com.deviceworks.history',
      Key: 'dev/'+fileName,
      ACL: 'public-read',
      Body: json,
      ContentType: 'application/json'
    };

  var upload = new AWS.S3.ManagedUpload({params: params});
  upload.send(function(err, data) {
      console.log(err, data);
      cb(err, data);
  });
};

module.exports = {
  uploadToS3: uploadToS3
};
