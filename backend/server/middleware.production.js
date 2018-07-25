var whitelist = ['https://apptorney.circuitbusiness.com', 'https://apptorney-cms.eu-gb.mybluemix.net'];
var cors = require('cors')
module.exports = function(app) {

    app.options('*', cors())
}