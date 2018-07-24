var whitelist = ["https://apptorney.circuitbusiness.com", "https://apptorney-cms.eu-gb.mybluemix.net"];
module.exports = {
    "initial": {
        "cors": {
            "params": {
                "origin": function(origin, callback) {
                    if (whitelist.indexOf(origin) !== -1) {
                        callback(null, true);
                    } else {
                        callback(new Error('Not allowed by CORS'));
                    }
                }
            }
        }
    }
};