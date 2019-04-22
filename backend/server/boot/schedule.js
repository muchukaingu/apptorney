'use strict';

module.exports = function scheduleMarkToMarket(app) {
    var schedule = require('node-schedule');
    var rule = new schedule.RecurrenceRule();
    var UserStats = app.models.userStats
    var Appuser = app.models.Appuser
    rule.hour = 17;
    rule.minute = 0;

    var j = schedule.scheduleJob(rule, function() {
        console.log('Now logging');
        var entry = {
            snapshotDate: new Date(Date.now()),
            numberOfUsers: 0,
            lastUserCount: 0,
            increase: 0
        }
        var call = 0;
        var callback = function() {
            if (call == 1) {
                entry.increase = entry.numberOfUsers - entry.lastUserCount
                UserStats.create(entry)
            }
            call++;

        }
        Appuser.count({}, function(err, count) {
            entry.numberOfUsers = count
            callback(null, entry)
        })
        UserStats.find({}, (err, users) => {
            let lastUserCount = users[users.length - 1].numberOfUsers
            entry.lastUserCount = lastUserCount
            callback(null, entry)
        })
    });
};


//nav: 7656174