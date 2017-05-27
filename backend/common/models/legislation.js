// var utils = require('../node_modules/loopback/lib/utils');


module.exports = function(Legislation) {


  Legislation.getDuplicates = function(cb){
    Legislation.find({order:'legislationName ASC'}, function(err, legislations) {

      var distinctIndexArray = [];
      var distinctArray = [];
      var duplicatesArray = [];
      var arr = legislations;

      for (var i = 0; i < arr.length; i++){
        arr[i].duplicateCount = 0;
      }

      for (var i = 0; i < arr.length; i++) {
          if (i == 0){
            distinctIndexArray.push(arr[i].legislationName);
            distinctArray.push(arr[i]);
          }
          else if (arr[i - 1].legislationName !== arr[i].legislationName) {

              distinctIndexArray.push(arr[i].legislationName);
              distinctArray.push(arr[i]);
          }
          else {
              duplicatesArray.push(arr[i]);
              distinctArray[distinctIndexArray.indexOf(arr[i].legislationName)].duplicateCount++;
          }
      }
      cb(null,distinctArray);
    });
  }

  Legislation.remoteMethod(
    'getDuplicates',{
      http: {path: '/duplicates', verb: 'get'},
      returns: {arg: 'duplicates', type: 'Object'}
  });


  Legislation.remoteMethod(
    'summary',{
      http: {path: '/summary', verb: 'get'},
      returns: {arg: 'summary', type: 'Object'}
    });

    Legislation.summary = function(cb) {

        Legislation.find({}, function(err, legislations) {
          var summary = {};
          var incomplete = [];
          var complete = 0;
          legislations.forEach(function(legislation){
            if(legislation.completionStatus == true){
              complete+=1;
            }
          });
          summary.totalLegislations = legislations.length;
          summary.completedLegislations = complete;
          summary.incompleteLegislations = summary.totalLegislations -   summary.completedLegislations;

          cb(null, summary);



        });



    };


    Legislation.observe('after save', function updatePerformance(ctx, next) {
      /*if (ctx.instance) {
        ctx.instance.performance = 99;
      } else {
        ctx.data.updated = new Date();
      }*/
      console.log("Updating performance...");
      var app = Legislation.app;

      var Appuser = app.models.appuser;
       //query the database for a single matching dog
       Appuser.find({}, function(err, users) {
           var performanceArray = [];
           users.forEach(function(user){
             user.performance = 0;

             Legislation.find({where: {capturedById: user.id, completionStatus:true}}, function(err, numberoflegislations){
               //console.log(numberoflegislations.length);
               user.performance = numberoflegislations.length;

               Appuser.upsert(user);


             });



           });




       });
      next();
    });
};
