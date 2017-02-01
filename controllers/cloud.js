var AWS = require('aws-sdk');
var accessKeyId =  process.env.AWS_ACCESS_KEY;
var secretAccessKey = process.env.AWS_SECRET_KEY;

AWS.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey
});
var S3 = new AWS.S3();

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
