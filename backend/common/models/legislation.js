module.exports = function(Legislation) {


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
};
