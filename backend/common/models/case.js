module.exports = function(Case) {


  Case.remoteMethod(
    'generateNames',{
        http: {path: '/generatenames', verb: 'get'},
        returns: {arg: 'names', type: ['string']}
    }
  );


  Case.generateNames = function(cb) {
      Case.find({}, function(err, cases) {

        var names = [];
        var complete = 0;
        cases.forEach(function(aCase){
          aCase.accuser = "";
          aCase.accused = "";
          if(aCase.plaintiffs.length > 1){
            aCase.accuser = aCase.plaintiffs[0].name + " and Others";
          }
          else {
            aCase.accuser = aCase.plaintiffs[0].name;
          }

          if(aCase.defendants.length > 1){
            aCase.accused = aCase.defendants[0].name + " and Others";
          }
          else {
            aCase.accused = aCase.defendants[0].name;
          }

          aCase.name = aCase.accuser + " Vs. "+aCase.accused;
          Case.upsert(aCase,function(err, data){});
          names.push(aCase.name);

        });


        cb(null, names);



      });



  };


/*
Case.observe('before save', function clearReferences(ctx, next) {

      var app = Case.app;

      var CaseLegislations = app.models.caseLegislations;
      var CaseCases = app.models.caseCases;
      var CaseWorks = app.models.caseWorks;


       if(ctx.isNewInstance == false || ctx.isNewInstance == undefined){

         CaseLegislations.destroyAll({caseId:ctx.data.id}, function(err, result) {
            console.log(result);
         });

         CaseCases.destroyAll({caseId:ctx.data.id}, function(err, result) {
            console.log(result);
         });

         CaseWorks.destroyAll({caseId:ctx.data.id}, function(err, result) {
            console.info("Case Works Deleted",result);
         });
       }

      next();
});
*/







};
