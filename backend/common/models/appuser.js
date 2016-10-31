var Case = require('./case');
module.exports = function(Appuser) {
  //appuser.settings.acls.length = 0;
  //appuser.settings.acls = require('./appuseracl');
  //console.log(appuser.settings.acls);
  // console.log(appuser);

  Appuser.remoteMethod(
    'performance',{
      http: {path: '/performance', verb: 'get'},
      returns: {arg: 'performance', type: '[Object]'}
    });

    Appuser.performance = function(cb) {
       var app = Appuser.app;

       var legislations = app.models.legislation;
        //query the database for a single matching dog
        Appuser.find({}, function(err, users) {
            users.forEach(function(user){
              user.performance = 0;
              legislations.find({where: {capturedById: user.id, completionStatus:true}}, function(err, numberoflegislations){
                //console.log(numberoflegislations.length);
                user.performance = numberoflegislations.length;
                if(users.indexOf(user)==users.length-1){
                    cb(null, users);
                }

              });



            });




        });

    }

};
