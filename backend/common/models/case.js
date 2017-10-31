module.exports = function(Case) {
  const {ObjectId} = require('mongodb'); // or ObjectID


  Case.remoteMethod(
    'generateNames',{
        http: {path: '/generatenames', verb: 'get'},
        returns: {arg: 'names', type: ['string']}
    }
  );

  Case.remoteMethod(
    'summariseCasePeriods',{
        http: {path: '/summarisecaseperiods', verb: 'get'},
        returns: {arg: 'summary', type: ['object']}
    }
  );

  Case.remoteMethod(
    'getDuplicates',{
      http: {path: '/duplicates', verb: 'get'},
      accepts:[
        {arg: 'skip', type: 'number'},
        {arg: 'limit', type: 'number'}
      ],
      returns: [
        {arg: 'duplicates', type: 'Object'},
        {arg: 'uniqueCount', type: 'Object'}
      ]
  });

  Case.remoteMethod(
    'namesakes',{
      http: {path: '/namesakes', verb: 'get'},
      accepts:[
        {arg: 'id', type: 'array'}
      ],
      returns: {arg: 'namesakes', type: 'Object'}
  });

  Case.remoteMethod(
    'mergeDuplicates',{
      http: {path: '/merge', verb: 'get'},
      accepts:[
        {arg: 'id', type: 'array'},
        {arg: 'primary', type: 'string'}
      ],
      returns: {arg: 'result', type: 'Object'}
  });


  Case.remoteMethod(
    'viewTrash',{
      http: {path: '/trash', verb: 'get'},
      returns: {arg: 'trash', type: 'Object'}
  });

  Case.remoteMethod(
    'viewCases',{
      http: {path: '/notdeleted', verb: 'get'},
      accepts:[
        {arg: 'skip', type: 'number'},
        {arg: 'limit', type: 'number'},
        {arg: 'query', type: 'string'},
        {arg: 'year', type: 'number'}
      ],
      returns: [
        {arg: 'cases', type: 'array'},
        {arg: 'count', type: 'number'}
      ]
  });


  Case.remoteMethod(
    'flexisearch',{
      http: {path: '/flexisearch', verb: 'get'},
      accepts: {arg: 'term', type: 'string'},
      returns: {arg: 'cases', type: 'Object'}
  });

  Case.remoteMethod(
    'viewCase',{
      http: {path: '/viewCase', verb: 'get'},
      accepts: {arg: 'id', type: 'string'},
      returns: {arg: 'cases', type: 'Object'}
  });


  /**
   * Searches for cases based on mongo's $text index
   *
   * @callback {Function} cb The callback function
   */
  Case.flexisearch = function(term, cb){
    var caseCollection = Case.getDataSource().connector.collection("case");
    caseCollection.aggregate([
        {$match: {$and:[{ "deleted": { $eq: !true } }, {$text:{$search:"\""+term+"\""}}]}},
        /*{
           $lookup:{
                 from: "areaOfLaw",
                 localField: "areaOfLawId",
                 foreignField: "_id",
                 as: "area"
           }
        },*/ //Comment out when areaOfLawId foreign key is converted to ObjectId in case model
        {$project:{
          score: { $meta: "textScore" },
          caseNumber: true,
          name:true,
          judgement:true,
          summaryOfRuling:true,
          summaryOfFacts:true,
          citation:true,
          areaOfLawId:true

        }},
        { $sort: { score: { $meta: "textScore" }, name: -1 } }

      ],
      function(err, cases) {
        console.log(err)
        if(err){

        }
        else{
          var counter = 0;
          cases.map(function(caseInstance){
            caseInstance.id = caseInstance._id;
            var citation = caseInstance.citation.year+"/"+caseInstance.citation.code+"/"+caseInstance.citation.pageNumber;
            caseInstance.referenceNumber = (!caseInstance.caseNumber&& caseInstance.citation.year && caseInstance.citation.code && caseInstance.citation.pageNumber)?citation:caseInstance.caseNumber;
            // caseInstance.areaOfLaw = caseInstance.areaOfLawName.name;
            delete caseInstance["_id"];
            delete caseInstance["citation"];
            delete caseInstance["caseNumber"];

            //### TEMPORAL AREA OF LAW FIX --> Due to performance issues this should be addressed by changing areaOfLawId in Case Model to ObjectId type so that $lookup op can work
            var app = Case.app;
            var Areas = app.models.areaOfLaw;
            Areas.findById(ObjectId(caseInstance.areaOfLawId), function(err, area){
              caseInstance.area = (area==null)?"":area.name;
              counter++;
              if(counter == cases.length){
                cb(null, cases)
              }
            })
            //### END OF TEMPORAL AREA OF LAW FIX

          });

          if(counter==0 && cases.length == 0){
            cb(null, cases)
          }


        }

      });


  }


  /**
   * Lists all cases that have not been soft deleted
   *
   * @callback {Function} cb The callback function
   */
   Case.viewCases = function(skip,limit, query, year, cb){
    console.log("Skip",skip*200);
    console.log("Limit",limit);
    console.log("Query",query);
    console.log("Year",year);
    var query = query?{name: {like: '.*'+ query +'.*', options:'i'}}:undefined;
    var yearQuery = year?{'citation.year':year}:undefined;
    //var whereClause = {and:[{deleted:{neq:true}}, query, yearQuery]};
    var whereClause = {or:[
      {and:[{name: {like: '.*'+year+'.*'}},{deleted:{neq:true}}]},{and:[yearQuery, {deleted:{neq:true}}]}, {and:[{caseNumber: {like: '.*'+year+'.*'}},{deleted:{neq:true}}]}
    ]};


    function callback(error, data){
      Case.find({where:whereClause}, function(err, cases){
        var count = cases.length;
        console.log("Count", cases.length);
        cb(null,data, count);
      })

    }

    Case.find({
      order:'name ASC',
      limit:200,
      skip:skip*200,
      where: whereClause,
      include: {
          relation: 'caseCases', // include the owner object
          scope: { // further filter the owner object
            fields: ['id'] // only show two fields
          }
      }

      },
      function(err, cases) {
        console.log("Where Clause ", whereClause);
        callback(null,cases);
      });
  }


  /**
   * Lists all cases that have not been soft deleted
   *
   * @callback {Function} cb The callback function
   */
   Case.viewCase = function(id, cb){
    Case.findById(id,
      {include: [{
        relation: 'plaintiffSynonym', // include the owner object
        scope: { // further filter the owner object
          fields: ['synonym'] // only show two fields
        }},
        {relation: 'defendantSynonym', // include the owner object
        scope: { // further filter the owner object
          fields: ['synonym'] // only show two fields
        }},
        {relation: 'court', // include the owner object
        scope: { // further filter the owner object
          fields: ['name'] // only show two fields
        }},
        {relation: 'location', // include the owner object
        scope: { // further filter the owner object
          fields: ['name'] // only show two fields
        }},
        {relation: 'jurisdiction', // include the owner object
        scope: { // further filter the owner object
          fields: ['name'] // only show two fields
        }},
        {relation: 'legislationsReferedTo', // include the owner object
        scope: { // further filter the owner object
          fields: ['legislationName'] // only show two fields
        }},
        {relation: 'casesReferedTo', // include the owner object
        scope: { // further filter the owner object
          fields: ['name'] // only show two fields
        }},
        {relation: 'workReferedTo', // include the owner object
        scope: { // further filter the owner object
          fields: ['name'] // only show two fields
        }},
        {relation: 'areaOfLaw', // include the owner object
        scope: { // further filter the owner object
          fields: ['name'] // only show two fields
        }}
      ]},

      function(err, cases) {
        cb(null,cases);
      });
  }




  /**
   * Lists all duplicated cases with the number of duplicate occurences
   *
   * @callback {Function} cb The callback function
   */
  Case.getDuplicates = function(skip,limit, cb){
    var caseCollection = Case.getDataSource().connector.collection("case");
    caseCollection.aggregate([
      {"$match": {$and:[{"deleted": { $eq: false }} ]}},
      {
          "$group": {
              "_id": { "name": {$toUpper:"$name"}, "caseNumber": {$toUpper:"$caseNumber"}},
              "uniqueIds": { "$addToSet": "$_id" },
              "count": { "$sum": 1 }
          }
      },
      { "$match": { "count": { "$gt": 1 } } }
    ],
    function(err, cases) {
      if(err){
        console.log(err);

      }
      else{
        console.log(cases.length);
        cases.map(function(caseInstance){
          caseInstance.fields = caseInstance._id;
          delete caseInstance["_id"];

        });
        cb(null, cases)
      }
    });
  }


  /**
   * Show Duplicate Details/ Duplicate Occurences
   *
   * @callback {Function} cb The callback function
   */
  Case.namesakes = function(id, cb){
    //var bson = require("bson");
    //var BSON = new bson.BSONPure.BSON();
    var IDs = [];
    id.forEach(function(id){
      var caseId = {
        id:id
      };
      IDs.push(caseId);
    });
    Case.find(
      {where:{or:IDs},
      include: {
          relation: 'caseCases', // include the owner object
          scope: { // further filter the owner object
            //fields: ['id'] // only show two fields
          }
      },
      filter:{ include: {
          relation: 'capturedBy', // include the owner object
          scope: { // further filter the owner object
            fields: ['firstName','lastName'] // only show two fields
          }
        }//,
        /*fields:{
          legislationParts:false,
          enactment: false,
          generalTitle: false,
          preamble:false
        }*/
      },
    },function(err, cases){
      cases.forEach(function(caseInstance){
        // caseInstance.size =  Math.round(BSON.calculateObjectSize(caseInstance)/(1024))+"KB";
        // console.log(caseInstance.id, Math.round(caseInstance.size/(1024))+"KB")
        caseInstance.size =  JSON.stringify(caseInstance).length
        console.log(caseInstance.id, caseInstance.size)
      })
      cb(null,cases);
    });
  }


  /**
   * Create access token for the logged in user. This method can be overridden to
   * customize how access tokens are generated
   *
   * @callback {Function} cb The callback function
   */

  Case.mergeDuplicates = function(id, primary, cb){
    var app = Case.app;
    var CaseCases = app.models.caseCases;
    var IDs = [];
    id.forEach(function(id){
      var caseId = {
        id:id
      };
      IDs.push(caseId);
    });

    Case.find({
        where:{or:IDs}//,
        /*filter:{
          fields:{
            legislationParts:false,
            enactment: false,
            generalTitle: false,
            preamble:false
          }
        },*/
      },
      function(err, cases){
        console.log()
        for(var i=0; i<cases.length; i++){
          console.log("To merge",cases.length);
          console.log(cases[i].name);
          if(String(cases[i].id) !== String(primary)){
            console.log(cases[i].id + " | " + String(primary));
            CaseCases.updateAll({caseReferedToId:cases[i].id},{caseReferedToId:primary}, function(err, info){
              // console.log(info.count);
              console.log(info);
            });

            Case.updateAll({id:cases[i].id},{deleted:true}, function(err, info){
              console.log("deleted",info);
            });
          }
        }
        cb(null,primary);
    });

  }



  Case.generateNames = function(cb) {
      Case.find({}, function(err, cases) {

        var names = [];
        var complete = 0;
        cases.forEach(function(aCase){
          aCase.accuser = "";
          aCase.accused = "";
          if(aCase.plaintiffs !==undefined && aCase.plaintiffs.length > 1){
            aCase.accuser = aCase.plaintiffs[0].name + " and Others";
          }
          else if (aCase.plaintiffs !==undefined && aCase.plaintiffs.length == 1) {
            aCase.accuser = aCase.plaintiffs[0].name;
          }
          else {
            aCase.accuser = "Undefined";
          }

          if(aCase.defendants !==undefined && aCase.defendants.length > 1){
            aCase.accused = aCase.defendants[0].name + " and Others";
          }
          else if (aCase.defendants !==undefined && aCase.defendants.length == 1) {
            aCase.accused = aCase.defendants[0].name;
          }

          else {
            aCase.accused = "Undefined";
          }

          aCase.name = aCase.accuser + " Vs. "+aCase.accused;

          console.log(aCase.name);
          Case.upsert(aCase,function(err, data){});
          names.push(aCase.name);

        });


        cb(null, names);



      });



  };


  Case.summariseCasePeriods = function(cb){
    var periods = [];
    var period = {name:"2010s"};
    Case.find({filter:{where: {
      or:[{name: {like: '.*201.*'}},{'citation.year':2016}, {caseNumber: {like: '.*201.*'}} ]
    }}}), function(err, cases) {
      if (err){
        console.info("Error Occured ", err);
        return;
      }
      console.info("Number of Cases ", cases.length);
      period.count = cases.length;
      periods.push(period);
      cb(null,periods);
    }

  }


  /**
   * Lists all cases that have been soft deleted
   *
   * @callback {Function} cb The callback function
   */
  Case.viewTrash = function(cb){
    Case.find({where:{deleted:true}} ,function(err, cases){
      cb(null,cases);
    });
  }



/*Case.observe('before save', function clearReferences(ctx, next) {

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
