// var utils = require('../node_modules/loopback/lib/utils');


module.exports = function(Legislation) {





  // MODEL FUNCTIONS ##############################################################################################



  /**
   * Lists all duplicated legislations with the number of duplicate occurences
   *
   * @callback {Function} cb The callback function
   */
  Legislation.getDuplicates = function(skip,limit, type, cb){

    //var query = query?{legislationName: {like: '.*'+ query +'.*', options:'i'}}:undefined;
    var query = {legislationType: {like: '.*'+ type +'.*', options:'i'}};
    Legislation.find({order:['legislationName ASC', 'dateOfAssent ASC'], limit:200, skip:skip*200, where:{and:[{deleted:{neq:true}}, query]}}, function(err, legislations) {
      console.log("Duplicates",legislations.length)
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
          // var prevDate = (i==0)?(new Date(arr[i].dateOfAssent).getFullYear()):(new Date(arr[i - 1].dateOfAssent).getFullYear());
          // var currDate = new Date(arr[i].dateOfAssent).getFullYear();
          // console.log(currDate);

          if (i == 0){
            distinctIndexArray.push(arr[i].legislationName);
            distinctArray.push(arr[i]);
          }
          else if (arr[i - 1].legislationName !== arr[i].legislationName /*&& prevDate !== currDate*/ ) {

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

  Legislation.namesakes = function(id, type, cb){
    var query = {legislationType: {like: '.*'+ type +'.*', options:'i'}};

    var callback = function(error, legislation){
      var year = new Date(legislation.dateOfAssent).getFullYear();

      var startDate = new Date(year+'-01-01T24:00:00.000Z');
      var endDate = new Date(year+'-12-31T23:59:00.000Z');
      var yearQuery = {dateOfAssent: {between: [startDate,endDate]}};
      console.log(yearQuery);
      Legislation.find(
        {where:{and:[{deleted:{neq:true}}, {legislationName:legislation.legislationName}, query, yearQuery]},
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
   * Create access token for the logged in user. This method can be overridden to
   * customize how access tokens are generated
   *
   * @callback {Function} cb The callback function
   */

  Legislation.mergeDuplicates = function(id, cb){
    var app = Legislation.app;
    var CaseLegislations = app.models.caseLegislations;


    var callback = function(error, legislation){

      Legislation.find({
          where:{and:[{deleted:{neq:true}}, {legislationName:legislation.legislationName}]},
          filter:{include: {
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
        },
        function(err, legislations){

          for(var i=0; i<legislations.length; i++){
            // console.log(legislations[i].legislationName);
            if(String(legislations[i].id) !== String(legislation.id)){
              console.log(legislations[i].id + " | " + String(legislation.id));
              CaseLegislations.updateAll({legislationId:legislations[i].id},{legislationId:legislation.id}, function(err, info){
                // console.log(info.count);
                // console.log(info);
              });

              Legislation.updateAll({parentLegislation:legislations[i].id},{parentLegislation:legislation.id}, function(err, info){
                console.log("Updated Parent Legislation",info);
              });

              Legislation.updateAll({id:legislations[i].id},{deleted:true}, function(err, info){
                console.log("deleted",info);
              });
            }

          }
          cb(null,legislation.id);
      });
    }
    Legislation.findById(id,function(err, legislation){
      callback(null,legislation)
    });
  }


  /**
   * Restore deleted items from trash
   *
   *
   * @callback {Function} cb The callback function
   */

  Legislation.restoreFromTrash = function(id, cb){
    Legislation.updateAll({id:id},{deleted:false}, function(err, info){
      console.log("Restored from trash: ",info);
      cb(null, info);
    });
  }

  /**
   * Restore deleted items from trash
   *
   *
   * @callback {Function} cb The callback function
   */
  Legislation.repareLegislationType = function (cb){
    // var whereClause = {legislationType:"577d66caa856154683e6c2c0"};
    var whereClause = {and:[{deleted:{neq:true}},{legislationType:{like: '.*'+ "577d66caa856154683e6c2c0" +'.*', options:'i'} }]};
    Legislation.updateAll({'legislationType.id':"58f6213db9aab46a3d769e73"},{legislationType:"58f6213db9aab46a3d769e73"}, function(err, legislations){
      console.log("To repare: ",legislations.length);
      // cb(null, legislations.length);
    });

    Legislation.updateAll({'legislationType.id':"577d66e6a856154683e6c2c1"},{legislationType:"577d66e6a856154683e6c2c1"}, function(err, legislations){
      console.log("To repare: ",legislations.length);
      // cb(null, legislations.length);
    });

    Legislation.updateAll({'legislationType.id':"577d66fca856154683e6c2c2"},{legislationType:"577d66fca856154683e6c2c2"}, function(err, legislations){
      console.log("To repare: ",legislations.length);
      // cb(null, legislations.length);
    });

    Legislation.updateAll({'legislationType.id':"57f5284b070211bef785a619"},{legislationType:"57f5284b070211bef785a619"}, function(err, legislations){
      console.log("To repare: ",legislations.length);
      // cb(null, legislations.length);
    });

    Legislation.updateAll({'legislationType.id':"591c4ac83af81692cc952f3c"},{legislationType:"591c4ac83af81692cc952f3c"}, function(err, legislations){
      console.log("To repare: ",legislations.length);
      // cb(null, legislations.length);
    });

    Legislation.updateAll({'legislationType.id':"577d66caa856154683e6c2c0"},{legislationType:"577d66caa856154683e6c2c0"}, function(err, legislations){
      console.log("To repare: ",legislations.length);
      cb(null, legislations.length);
    });

    /*

    Legislation.find({where:whereClause}, function(err, legislations){
      console.log("Acts: ", legislations.length);
      var legislationType = legislations[0];
      console.log("Legislation Type: ",legislationType.legislationType);
    });


    var legislationCollection = Legislation.getDataSource().connector.collection("legislation");
    legislationCollection.distinct('legislationType', function(err, types) {
      if(err){

      }
      else{
        // var count = legislations.length;
        // cb(null, data, count)
        console.log("Types: ", types)
        var strange = types[4];
        var normal = types[0];
        console.log(strange + "|"+normal);
      }

    });

    */
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
   * Gets all unique occurences based on Legislation Name
   *
   * @callback {Function} cb The callback function
   */
  Legislation.search = function(term, cb){
    var legislationCollection = Legislation.getDataSource().connector.collection("legislation");
    legislationCollection.aggregate([
        {$match:{$text:{$search:"\""+term+"\""}}},
        {
           $lookup:{
                 from: "appuser",
                 localField: "capturedById",
                 foreignField: "_id",
                 as: "capturedBy"
           }
        }
      ],
      function(err, legislations) {
        if(err){

        }
        else{
          legislations.map(function(legislation){
            legislation.id = legislation._id;
            delete legislation["_id"];

          });
          cb(null, legislations)
          /*legislations = legislations.toArray(function(err, legislations){
            //console.log("Count", legislations);
            legislations.map(function(legislation){
              legislation.id = legislation._id;
              delete legislation["_id"];

            });
            cb(null, legislations)
          });
          */

        }

      });
  }


  /**
   * Gets all unique occurences based on Legislation Name
   *
   * @callback {Function} cb The callback function
   */
  Legislation.flexisearch = function(term, cb){
    var legislationCollection = Legislation.getDataSource().connector.collection("legislation");
    legislationCollection.find({$text:{$search:term}}, function(err, legislations) {
      if(err){

      }
      else{
        legislations = legislations.toArray(function(err, legislations){
          //console.log("Count", legislations);
          cb(null, legislations)
        });

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
    var whereClause = {and:[{deleted:{neq:true}}, query,{legislationType:{like: '.*'+ type +'.*', options:'i'} }]};

    function callback(error, data){
      Legislation.find({where:whereClause}, function(err, legislations){
        var count = legislations.length;
        console.log("Count", legislations.length);
        cb(null,data, count);
      })

    }

    Legislation.find({
      order:'legislationName ASC',
      limit:200,
      skip:skip*200,
      where: whereClause
      },
      function(err, legislations) {
        callback(null,legislations);
      });
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
        {arg: 'type', type: 'string'}
      ],
      returns: [
        {arg: 'duplicates', type: 'Object'},
        {arg: 'uniqueCount', type: 'Object'}
      ]
  });

  Legislation.remoteMethod(
    'namesakes',{
      http: {path: '/namesakes', verb: 'get'},
      accepts:[
        {arg: 'id', type: 'string'},
        {arg: 'type', type: 'string'}
      ],
      returns: {arg: 'namesakes', type: 'Object'}
  });


  Legislation.remoteMethod(
    'mergeDuplicates',{
      http: {path: '/merge', verb: 'get'},
      accepts: {arg: 'id', type: 'string'},
      returns: {arg: 'result', type: 'Object'}
  });

  Legislation.remoteMethod(
    'restoreFromTrash',{
      http: {path: '/restore', verb: 'get'},
      accepts: {arg: 'id', type: 'string'},
      returns: {arg: 'result', type: 'Object'}
  });

  Legislation.remoteMethod(
    'search',{
      http: {path: '/search', verb: 'get'},
      accepts: {arg: 'term', type: 'string'},
      returns: {arg: 'legislations', type: 'Object'}
  });


  Legislation.remoteMethod(
    'flexisearch',{
      http: {path: '/flexisearch', verb: 'get'},
      accepts: {arg: 'term', type: 'string'},
      returns: {arg: 'legislations', type: 'Object'}
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


  Legislation.remoteMethod(
    'repareLegislationType',{
      http: {path: '/repare', verb: 'get'},
      returns: {arg: 'info', type: 'Object'}
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
