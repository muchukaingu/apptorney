var Case = require('./case');
module.exports = function(Appuser) {
  //appuser.settings.acls.length = 0;
  //appuser.settings.acls = require('./appuseracl');
  //console.log(appuser.settings.acls);
  // console.log(appuser);

  Appuser.remoteMethod(
    'performance',{
      http: {path: '/performance', verb: 'get'},
      returns: {arg: 'performance', type: '[{}]'}
    });

    Appuser.performance = function(cb) {
      Appuser.find({}, function(err, users) {
        cb(null, users);
      });

    }


};
