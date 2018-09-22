'use strict';

module.exports = function(ResponseHandler) {
    ResponseHandler.sendCallback = function(success, statusCode, err, errMessage, successMessage, data, cb) {
        console.log("sendCallback called" + err)
        let message = {};
        message.success = success;
        message.statusCode = statusCode;
        if (statusCode === 200) {
            message.message = successMessage;
            message.data = data;
        } else {
            message.err = err;
            message.message = errMessage;
        }
        cb(null, message)
    }
};