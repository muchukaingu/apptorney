// var utils = require('../node_modules/loopback/lib/utils');


module.exports = function(Legislation) {
  const {ObjectId} = require('mongodb'); // or ObjectID

  // MODEL FUNCTIONS ##############################################################################################

  /**
   * Lists all duplicated legislations with the number of duplicate occurences
   *
   * @callback {Function} cb The callback function
   */
  Legislation.getDuplicates = function(skip,limit, type, cb){
    var legislationCollection = Legislation.getDataSource().connector.collection("legislation");
    legislationCollection.aggregate([
      { "$match": {$and:[{ "legislationType": { $eq: type } }, { "deleted": { $eq: false } }]} },
      {
          "$group": {
              "_id": { "legislationName": {$toUpper:"$legislationName"}, "legislationNumber": "$legislationNumber", "year":{$year:"$dateOfAssent"}, "chapterNumber": "$chapterNumber"},
              "uniqueIds": { "$addToSet": "$_id" },
              "count": { "$sum": 1 }
          }
      },
      { "$match": { "count": { "$gt": 1 } } }
    ],
    function(err, legislations) {
      if(err){
        console.log(err);

      }
      else{
        console.log(legislations.length);
        legislations.map(function(legislation){
          legislation.fields = legislation._id;
          delete legislation["_id"];

        });
        cb(null, legislations)
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

    var IDs = [];
    id.forEach(function(id){
      var legislationId = {
        id:id
      };
      IDs.push(legislationId);
    });


    Legislation.find(
      {where:{or:IDs},
      include: {
          relation: 'caseLegislations', // include the owner object
          scope: { // further filter the owner object
            fields: ['id'] // only show two fields
          }
      },
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

    /*var query = {legislationType: {like: '.*'+ type +'.*', options:'i'}};

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
    */





  }


  /**
   * Create access token for the logged in user. This method can be overridden to
   * customize how access tokens are generated
   *
   * @callback {Function} cb The callback function
   */

  Legislation.mergeDuplicates = function(id, primary, cb){
    var app = Legislation.app;
    var CaseLegislations = app.models.caseLegislations;
    var IDs = [];
    id.forEach(function(id){
      var legislationId = {
        id:id
      };
      IDs.push(legislationId);
    });

    Legislation.find({
        where:{or:IDs},
        filter:{
          fields:{
            legislationParts:false,
            enactment: false,
            generalTitle: false,
            preamble:false
          }
        },
      },
      function(err, legislations){
        console.log()
        for(var i=0; i<legislations.length; i++){
          console.log("To merge",legislations.length);
          console.log(legislations[i].legislationName);
          if(String(legislations[i].id) !== String(primary)){
            console.log(legislations[i].id + " | " + String(primary));
            CaseLegislations.updateAll({legislationId:legislations[i].id},{legislationId:primary}, function(err, info){
              // console.log(info.count);
              console.log(info);
            });
            Legislation.updateAll({parentLegislation:legislations[i].id},{parentLegislation:primary}, function(err, info){
              console.log("Updated Parent Legislation",info);
            });
            Legislation.updateAll({id:legislations[i].id},{deleted:true}, function(err, info){
              console.log("deleted",info);
            });
          }
        }
        cb(null,primary);
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
  Legislation.repareParagraphs = function (cb){
    Legislation.find({}, (err,legislations) => {
      console.log('Length ', legislations.length);
      for(let i = 0; i < legislations.length-1; i++){
        let legislation = legislations[i];
        let parts = legislation.legislationParts?legislation.legislationParts:[];
        // console.log('Parts Length', parts.length)
        let counter = 0;
        for (let j = 0; j < parts.length-1; j++){
          let part = parts[j];
          if(part.content){
            for (let s = 0; s < part.content.length-1; s++ ){
              if (part.content.indexOf('\n')!==-1){
                let newLineIndex = part.content.indexOf('\n');
                if(newLineIndex - 1 !== ';' && newLineIndex - 1 !== '.' && newLineIndex - 1 !== ':' && newLineIndex - 1 !== ';' && newLineIndex - 1 !== '-'){
                  (counter < 10)?console.log('To fix', part.content):{};
                  //console.log('COUNTER', counter);
                  counter++;

                }
              }
            }
          };
        }
      }
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
   * Gets all unique occurences based on Legislation Name
   *
   * @callback {Function} cb The callback function
   */
  Legislation.search = function(term, type, cb){
    var legislationCollection = Legislation.getDataSource().connector.collection("legislation");
    legislationCollection.aggregate([
        {$match: {$and:[{ "legislationType": { $eq: type } }, { "deleted": { $eq: !true } }, {$text:{$search:"\""+term+"\""}}]} },
        //{$match:{$text:{$search:"\""+term+"\""}}},
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
    legislationCollection.aggregate([
        {$match: {$and:[{ "deleted": { $eq: !true } }, {$text:{$search:term}}]}},
        {$project:{
          score: { $meta: "textScore" },
          legislationName:true,
          preamble:true,
          legislationParts:true,
          legislationType:true

        }},
        { $sort: { score: { $meta: "textScore" }, legislationName: -1 } }

      ] ,
      function(err, legislations) {
        if(err){

        }
        else{
          //### TEMPORAL AREA OF LAW FIX --> Due to performance issues this should be addressed by changing areaOfLawId in Case Model to ObjectId type so that $lookup op can work
          var app = Legislation.app;
          var legislationTypes = app.models.legislationType;
          var counter = 0;
          legislations.map(function(legislation){

            legislation.id = legislation._id;
            delete legislation["_id"];
            legislationTypes.findById(ObjectId(legislation.legislationType), function(err, type){
              if(err){
                console.log("Error ", err);
              }
              if (type==null){
                console.log("Offending Legislation ", legislation.legislationName + " / " +legislation.id);
              }
              legislation.legislationType = type.name;
              counter++;
              if(counter == legislations.length){
                cb(null,legislations);
              }
            })

          });

          //### END OF TEMPORAL AREA OF LAW FIX

        }

      });


  }

  /**
   * Lists all legislations that have not been soft deleted
   *
   * @callback {Function} cb The callback function
   */
   Legislation.viewLegislations = function(skip,limit, query, type, cb){
    console.log("Skip",skip*200);
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
      where: whereClause,
      include: {
          relation: 'caseLegislations', // include the owner object
          scope: { // further filter the owner object
            fields: ['id'] // only show two fields
          }
      }

      },
      function(err, legislations) {
        //### TEMPORAL AREA OF LAW FIX --> Due to performance issues this should be addressed by changing areaOfLawId in Case Model to ObjectId type so that $lookup op can work
        var app = Legislation.app;
        var legislationTypes = app.models.legislationType;
        var counter = 0;
        console.log(legislations.length)
        legislations.map(function(legislation){
          console.log(legislation.legislationName)
          legislationTypes.findById(ObjectId(legislation.legislationType), function(err, type){
            legislation.legislationType = type.name;
            counter++;
            if(counter == legislations.length){
              callback(null,legislations);
            }
          })

        });

        //### END OF TEMPORAL AREA OF LAW FIX



      });
  }


  /**
   * Lists all legislations that have been soft deleted
   *
   * @callback {Function} cb The callback function
   */
  Legislation.viewTrash = function(cb){
    /*var callback = function(error, legislations){
      var deleted = [];
      for (var i = 0; i < legislations.length; i++){
        if(legislations[i].deleted == true){
          deleted.push(legislations[i]);
        }
        if(i==legislations.length-1){
          cb(null, deleted);
        }
      }


    }*/

    Legislation.find({where:{deleted:true}} ,function(err, legislations){
      cb(null,legislations);
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
        {arg: 'id', type: 'array'},
        {arg: 'type', type: 'string'}
      ],
      returns: {arg: 'namesakes', type: 'Object'}
  });


  Legislation.remoteMethod(
    'mergeDuplicates',{
      http: {path: '/merge', verb: 'get'},
      accepts:[
        {arg: 'id', type: 'array'},
        {arg: 'primary', type: 'string'}
      ],
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
      accepts:[
        {arg: 'term', type: 'string'},
        {arg: 'type', type: 'string'}
      ],
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
        {arg: 'legislations', type: 'array'},
        {arg: 'count', type: 'number'}
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
