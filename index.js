var logic = require("./controllers/logic");

exports.handler = function(event, context) {
  var hrstart = process.hrtime();
  console.log('Environment '+process.env.AWS_ENVIRONMENT)
  console.log('Context: '+JSON.stringify(context));
  console.log('Initiating '+ (new Date()).toString());
  logic.fetchToday(event, context, function(err) {
    if (err) {
      console.log("Finished with error: "+error);
    }
    var hrend = process.hrtime(hrstart);
    console.info("Execution time (hr): %ds %dms", hrend[0], hrend[1]/1000000);
    context.done();
  });
};
