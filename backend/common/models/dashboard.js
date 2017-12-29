// var utils = require('../node_modules/loopback/lib/utils');


module.exports = function(Dashboard) {


  Dashboard.remoteMethod(
    'summary',{
      http: {path: '/summary', verb: 'get'},
      returns: {arg: 'summary', type: 'Object'}
    });

  Dashboard.summary = function(cb) {
      var app = Dashboard.app;
      var Legislation = app.models.legislation;
      var Case = app.models.case;
      var summary = {};
      var callbackCalls = 0;

      function callback(err, data){
        if(callbackCalls == 1){
          cb(err, data);
        }
        callbackCalls++;

      }

      Legislation.find({}, function(err, legislations) {
        var incomplete = [];
        var complete = 0;
        legislations.forEach(function(legislation){
          if(legislation.completionStatus == true){
            complete+=1;
          }
        });
        summary.totalLegislations = legislations.length;
        summary.completedLegislations = complete;
        summary.incompleteLegislations = summary.totalLegislations - summary.completedLegislations;
        callback(null, summary);
      });


      Case.find({}, function(err, cases) {
        var incomplete = [];
        var complete = 0;
        cases.forEach(function(aCase){
          if(aCase.completionStatus == true){
            complete+=1;
          }
        });
        summary.totalCases = cases.length;
        summary.completedCases = complete;
        summary.incompleteCases = summary.totalCases - summary.completedCases;
        callback(null, summary);
      });






  };
};
