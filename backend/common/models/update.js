'use strict';

module.exports = function(Update) {


    Update.remoteMethod('checkForUpdate', {
        description: 'For for updates that are required',
        http: {
            path: '/checkForUpdate',
            verb: 'POST'
        },
        accepts: [{
            arg: 'version',
            type: 'string',
            required: "true"
        }],
        returns: {
            type: 'string',
            root: true
        },
    });

    Update.checkForUpdate = function(version, cb) {
        var app = Update.app;
        var ResponseHandler = app.models.ResponseHandler;
        Update.findOne({ where: { version: version, update: true } }, (err, update) => {
            if (err) {
                ResponseHandler.sendCallback(true, 200, err, undefined, "Version not found. Update not needed", "noUpdate", cb);
            }
            if (update) {
                ResponseHandler.sendCallback(true, 200, err, undefined, "App is outdated. Update is required", "update", cb);
            } else {
                ResponseHandler.sendCallback(true, 200, err, undefined, "Version not found. Update not needed", "noUpdate", cb);
            }
        })

    }


    var date_diff_indays = function(date1, date2) {
        var dt1 = new Date(date1);
        var dt2 = new Date(date2);
        return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
    }



};