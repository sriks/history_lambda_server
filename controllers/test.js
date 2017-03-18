/**
Testing Sandbox for testing individual modules.
Use context.json to configure as ...
{"testing":true,"test":"fetchEntities"}
**/

var testJSON = require('../test.json');
var entities = require('./entities');
var prettyjson = require('prettyjson');

var test = function(toTest, cb) {
  console.log('** Running in TEST mode. See context.json **');
  console.log('Testing '+toTest+'\n');
  if ('fetchEntities' === toTest) {
    testFetchEntities(function(err, entities) {
      console.log('Finished TEST');
    });
  }
}

var testFetchEntities = function(cb) {
  var content = testJSON.content;
  entities.fetchEntities(content, function(err, entities) {
    if (entities) {
      console.log(prettyjson.render(entities));
    } else {
      console.log(err);
    }
    cb(err, entities);
  });
}

module.exports = {
  test: test
};
