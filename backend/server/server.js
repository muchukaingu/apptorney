var loopback = require('loopback');
var boot = require('loopback-boot');
// var zlib = require('zlib');
var compression = require('compression');

var path = require('path');

var app = module.exports = loopback();

var cors = require('cors')

//app.use(loopback.compress());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})



app.use(loopback.static(path.resolve(__dirname, '../client')));


app.start = function() {
    // start the web server
    return app.listen(function() {
        app.emit('started');
        var corsOptions = {
            origin: 'apptorney-cms.eu-gb.mybluemix.net',
            optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
        }
        app.options('*', cors(corsOptions)) // include before other routes
        var baseUrl = app.get('url').replace(/\/$/, '');

        console.log('Web server listening at: %s', baseUrl);
        if (app.get('loopback-component-explorer')) {
            var explorerPath = app.get('loopback-component-explorer').mountPath;
            console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
        }


    });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
    if (err) throw err;

    // start the server if `$ node server.js`
    if (require.main === module)
        app.start();
});