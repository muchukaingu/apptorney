'use strict';

module.exports = function(Subscription) {
    Subscription.createTrial = function(cb) {
        var activationDate = new Date(Date.now());
        var expiryDate = new Date();
        expiryDate.setDate(activationDate.getDate() + 1);
        Subscription.create({ numberOfSlots: 1, numberOfAssignments: 1, activationDate: activationDate, expiryDate: expiryDate }, (err, subscription) => {
            if (err) {
                console.log("error occured");
                cb(err, null);
            } else if (subscription) {
                cb(null, subscription);
            }


        })
    }

    Subscription.remoteMethod('checkSubscription', {
        description: 'For checking validity of user subscriptions',
        http: {
            path: '/checkSubscription',
            verb: 'POST'
        },
        accepts: [{
            arg: 'userName',
            type: 'string',
            required: "true"
        }],
        returns: {
            type: 'object',
            root: true
        },
    });

    Subscription.checkSubscription = function(userName, cb) {
        var app = Subscription.app;
        var Appuser = app.models.Appuser;
        Appuser.findOne({ where: { username: userName } }, (err, user) => {
            if (err) {
                //TODO proper error handling
                console.log("user not found");
                cb(err, null);
            }
            if (user) {
                console.log(user)
                Subscription.findById(user.currentSubscription, (err, subscription) => {
                    console.log(subscription)
                        //TODO check expiry
                    if (date_diff_indays(Date.now(), subscription.expiryDate) <= 0) {
                        console.log("subscription has expired");
                        cb(null, false)
                            //TODO send appropriate response to app;
                    } else {
                        console.log("subscription is still valid");
                        cb(null, true)
                            //TODO send appropriate response to app;
                    }
                })
            }
        })

    }


    var date_diff_indays = function(date1, date2) {
        var dt1 = new Date(date1);
        var dt2 = new Date(date2);
        return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
    }

};