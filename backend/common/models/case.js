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
          names.push(aCase.name);
        });


        cb(null, names);



      });



  };

};
