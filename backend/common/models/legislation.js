// var utils = require('../node_modules/loopback/lib/utils');


module.exports = function(Legislation) {





  // MODEL FUNCTIONS ##############################################################################################

  /**
   * Lists all duplicated legislations with the number of duplicate occurences
   *
   * @callback {Function} cb The callback function
   */
  Legislation.getDuplicates = function(skip,limit, query, cb){

    var query = query?{legislationName: {like: '.*'+ query +'.*', options:'i'}}:undefined;
    Legislation.find({order:'legislationName ASC', limit:200, skip:skip*200, where:{and:[{deleted:{neq:true}}, query]}}, function(err, legislations) {
      var duplicates = [];
      function callback(err, res){

        var data = res;
        data.forEach(function(elem){
          if (elem.duplicateCount > 1){
            duplicates.push(elem);
          }
        });

        Legislation.uniqueCount(duplicates, cb);
      }
      var distinctIndexArray = [];
      var distinctArray = [];
      var duplicatesArray = [];
      var arr = legislations;

      for (var i = 0; i < arr.length; i++){
        arr[i].duplicateCount = 1;
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
          if(i==arr.length-1){
            callback(null,distinctArray);
          }
      }
    });
  }

  /**
   * Create access token for the logged in user. This method can be overridden to
   * customize how access tokens are generated
   *
   * @callback {Function} cb The callback function
   */

  Legislation.namesakes = function(id, cb){
    var callback = function(error, legislation){
      Legislation.find(
        {where:{and:[{deleted:{neq:true}}, {legislationName:legislation.legislationName}]},
        filter:{ include: {
            relation: 'capturedBy', // include the owner object
            scope: { // further filter the owner object
              fields: ['firstName','lastName'] // only show two fields
            }
          },
          fields:{
            legislationParts:false,
            enactment: false,
            generalTitle: false,
            preamble:false
          }
        },

      },function(err, legislations){
        cb(null,legislations);
      });
    }
    Legislation.findById(id,function(err, legislation){
      callback(null,legislation)
    });
  }


  /**
   * Shows completion summary of legislations
   *
   * @callback {Function} cb The callback function
   */
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

  /**
   * Gets all unique occurences based on Legislation Name
   *
   * @callback {Function} cb The callback function
   */
  Legislation.uniqueCount = function(data, cb){
    var legislationCollection = Legislation.getDataSource().connector.collection("legislation");
    legislationCollection.distinct('legislationName', function(err, legislations) {
      if(err){

      }
      else{
        var count = legislations.length;
        cb(null, data, count)
      }

    });
  }

  /**
   * Lists all legislations that have not been soft deleted
   *
   * @callback {Function} cb The callback function
   */
  Legislation.viewLegislations = function(skip,limit, query, type, cb){
    console.log("Skip",skip);
    console.log("Limit",limit);
    console.log("Query",query);
    console.log("Type",type);
    var query = query?{legislationName: {like: '.*'+ query +'.*', options:'i'}}:undefined;
    function callback(error, data){
      Legislation.find({where:{legislationType:type}}, function(err, legislations){
        var count = legislations.length;
        console.log("Count", legislations.length);
        cb(null,data, count);
      })

    }
    Legislation.find({order:'legislationName ASC', limit:50, skip:skip*50}, function(err, legislations){
      console.log("Legislations", legislations.length);
      console.log("Error", err);
      callback(null,legislations);
      //console.log(legislations.length);
    })
  }

  /**
   * Lists all legislations that have been soft deleted
   *
   * @callback {Function} cb The callback function
   */
  Legislation.viewTrash = function(cb){
    var callback = function(error, legislations){
      var deleted = [];
      for (var i = 0; i < legislations.length; i++){
        if(legislations[i].deleted == true){
          deleted.push(legislations[i]);
        }
        if(i==legislations.length-1){
          cb(null, deleted);
        }
      }


    }

    Legislation.find({where:{deleted:true}} ,function(err, legislations){
      callback(null,legislations);
    });
  }

  // REMOTE METHODS ##############################################################################################

  Legislation.remoteMethod(
    'getDuplicates',{
      http: {path: '/duplicates', verb: 'get'},
      accepts:[
        {arg: 'skip', type: 'number'},
        {arg: 'limit', type: 'number'},
        {arg: 'query', type: 'string'}
      ],
      returns: [
        {arg: 'duplicates', type: 'Object'},
        {arg: 'uniqueCount', type: 'Object'}
      ]
  });

  Legislation.remoteMethod(
    'namesakes',{
      http: {path: '/namesakes', verb: 'get'},
      accepts: {arg: 'id', type: 'string'},
      returns: {arg: 'namesakes', type: 'Object'}
  });

  Legislation.remoteMethod(
    'summary',{
      http: {path: '/summary', verb: 'get'},
      returns: {arg: 'summary', type: 'Object'}
  });

  Legislation.remoteMethod(
    'viewLegislations',{
      http: {path: '/notdeleted', verb: 'get'},
      accepts:[
        {arg: 'skip', type: 'number'},
        {arg: 'limit', type: 'number'},
        {arg: 'query', type: 'string'},
        {arg: 'type', type: 'string'}
      ],
      returns: [
        {arg: 'legislations', type: 'Object'},
        {arg: 'count', type: 'Object'}
      ]
  });

  Legislation.remoteMethod(
    'viewTrash',{
      http: {path: '/trash', verb: 'get'},
      returns: {arg: 'trash', type: 'Object'}
  });


  // HOOKS ########################################################################################################

  Legislation.observe('after save', function updatePerformance(ctx, next) {
    var app = Legislation.app;
    var Appuser = app.models.appuser;
    Appuser.find({}, function(err, users) {
         var performanceArray = [];
         users.forEach(function(user){
           user.performance = 0;
           Legislation.find({where: {capturedById: user.id, completionStatus:true}}, function(err, numberoflegislations){
             user.performance = numberoflegislations.length;
             Appuser.upsert(user);
           });
         });
     });
    next();
  });
};
