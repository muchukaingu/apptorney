// /server/boot/hook.js
module.exports = function(app) {
  var remotes = app.remotes();
  // modify all returned values
  remotes.after('**', function (ctx, next) {
    var modelName = ctx.method.sharedClass.name;
    var singular = modelName
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, function(str){ return str.toUpperCase(); })
    var plural = createPlural(modelName)
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, function(str){ return str.toUpperCase(); })
    modelName = modelName.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1);});


    var currentModel = {
      name:app.models[modelName].definition.name,
      singular_label:singular,
      plural_label:plural,
      properties: app.models[modelName].definition.rawProperties,
      relations: app.models[modelName].definition.settings.relations
    };
    if(modelName !== "appuser" && modelName !== "Appuser"){
      ctx.result = {
        data: ctx.result,
        model:currentModel
      };
    }


    next();

  });

  function createPlural(text){
    if (text.slice(-1)=="y"){
      text = text.substring(0, text.length-1)+"ies";
    }
    else {
      text = text + "s";
    }
    return text;
  }
};
