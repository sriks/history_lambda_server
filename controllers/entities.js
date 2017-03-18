/**
This module fetches related entities from the supplied content.
**/

var _ = require('underscore');
var S = require('string');
var request = require("request");
var prettyjson = require('prettyjson');
var jsonQuery = require('json-query');

/*
Fetches related entities from the supplied content.
Response structure is an array as follows
[
  {"title": title,
  "abstract": abstract,
  "wikipediaURL": URL,
  "image":{"full":fullURL, "thumbnail":thumbnailURL}},
  ...
]
*/
var fetchEntities = function(content, cb) {
  fetchEntitiesUsingDandelion(content, cb);
};

var fetchEntitiesUsingDandelion = function(text, cb) {
  // Ensure we are within the char limit.
  var unescaped = S(text).decodeHTMLEntities().s
  unescaped = S(unescaped).replaceAll('<p>', '').s;
  unescaped = S(unescaped).replaceAll('</p>', '').s;
  text = S(unescaped).left(4096).s;

  var request = require("request");
  var options = { method: 'GET',
    url: 'https://api.dandelion.eu/datatxt/nex/v1/',
    qs:
     {
       token: process.env.DANDELION_KEY,
       text: text,
       include: 'abstract,image',
       epsilon: 0.5,
       min_confidence: 0.8
     },
     headers:
        {  'content-type': 'application/json' }
     };

  request(options, function (error, response, body) {
    if (error) {
        console.log('fetchEntitiesUsingDandelion' + error);
        cb(error, null);
    } else {
        body = JSON.parse(body);
        var entities = parseDandelionResponse(body);
        cb(null, entities);
    }
  });
}

var parseDandelionResponse = function(data) {
  var result =
  jsonQuery('annotations[* confidence > 0.8]' , {
    data: data
  }).value;
  if (!result) {
    return null;
  }

  // Unique titles
  var uniqueTitles = _.pluck(result, 'title');
  ourTitles = _.uniq(uniqueTitles);
  var entities = [];
  _.each(result, function(item) {
    var thisTitle = item["title"];
    if (_.indexOf(uniqueTitles, thisTitle) != -1) {
      // Check that we dont duplicate.
      uniqueTitles = _.without(uniqueTitles, thisTitle);
      // Pick only the keys we are interested in.
      var normalizedEntity = _.pick(item, 'title', 'abstract', 'image');
      normalizedEntity["wikipediaURL"] = item["uri"];
      entities.push(normalizedEntity);
    }
  });
  return entities;
}

module.exports = {
    fetchEntities: fetchEntities
}
