module.exports = function(Customer) {
    const { ObjectId } = require('mongodb') // or ObjectID
    Customer.validatesUniquenessOf('emailAddress', { message: 'Customer with this email address already exists' })
    Customer.validatesUniquenessOf('phoneNumber', { message: 'Customer with this phone number already exists' })
        // var loan = {}
    Customer.remoteMethod(
        'summary', {
            http: { path: '/summary', verb: 'get' },
            accepts: { arg: 'id', type: 'string' },
            returns: { arg: 'summary', type: 'Object' }
        })

    Customer.remoteMethod(
        'bookmark', {
            http: { path: '/bookmark', verb: 'post' },
            accepts: [
                { arg: 'sourceId', type: 'string' },
                { arg: 'username', type: 'string' },
                { arg: 'type', type: 'string' }
            ],
            returns: { arg: 'bookmark', type: 'Object' }
        })

    Customer.remoteMethod(
        'bookmarks', {
            http: { path: '/bookmarks', verb: 'get' },
            accepts: { arg: 'username', type: 'string' },
            returns: { arg: 'bookmarks', type: 'Object', root: true }
        })

    /**
     * Shows completion summary of legislations
     *
     * @callback {Function} cb The callback function
     */
    Customer.summary = function(id, cb) {
        var app = Customer.app
            // var Loan = app.models.LoanTransaction

        /*function callback(err, customer) {
            Loan.find({ where: { customerId: customer.id, status: { neq: "disbursed" } } }, function(err, loans) {
                var aCustomer = {}
                aCustomer = customer
                aCustomer.currentLoans = loans
                console.info('Customer', aCustomer)
                cb(null, aCustomer)
            })
        }*/
        Customer.findById(id, {
                /*include: {
                    relation: 'loans'
                }*/
            },
            function(err, customer) {
                // callback(null, customer)
                cb(null, customer)
            })
    }

    /**
     * Add Bookmarks
     * @param {String} id 
     * @callback {Function} cb The callback function
     */
    Customer.bookmark = function(sourceId, username, type, cb) {
        var app = Customer.app
        var Case = app.models.Case
        var Legislation = app.models.Legislation
            // Case Bookmarks

        if (type == 'case') {
            this.findOne({ where: { phoneNumber: username } }, function(err, customer) {
                if (customer == null) {
                    cb(err, null)
                } else {
                    Case.findOne({ where: { id: ObjectId(sourceId) } },
                        function(err, instance) {
                            if (instance == null) {
                                console.log('case not found', sourceId)
                                cb(err, null)
                            } else {
                                var bookmark = {
                                    title: instance.name,
                                    summary: instance.summaryOfFacts,
                                    sourceId: instance.id,
                                    type: 'case'
                                }
                                if (customer.bookmarks == undefined) { customer.bookmarks = [] }
                                var found = 0
                                customer.bookmarks.forEach(function(bookmark) {
                                    if (bookmark.sourceId == sourceId) {
                                        found++
                                        customer.bookmarks.splice(customer.bookmarks.indexOf(bookmark), 1)
                                        customer.save(function(err) {
                                            if (err) {
                                                cb(err)
                                            } else {
                                                console.log(instance.name)
                                                console.log(customer.firstName)
                                                cb(null, customer)
                                            }
                                        })
                                    }
                                })
                                if (found == 0) {
                                    customer.bookmarks.push(bookmark)
                                    customer.save(function(err) {
                                        if (err) {
                                            cb(err)
                                        } else {
                                            console.log(instance.name)
                                            console.log(customer.firstName)
                                            cb(null, customer)
                                        }
                                    })
                                }
                            }
                        })
                }
            })
        } else if (type == 'legislation') {
            this.findOne({ where: { phoneNumber: username } }, function(err, customer) {
                if (customer == null) {
                    cb(err, null)
                } else {
                    Legislation.findOne({ where: { id: ObjectId(sourceId) } },
                        function(err, instance) {
                            if (instance == null) {
                                console.log('legislation not found', sourceId)
                                cb(err, null)
                            } else {
                                var bookmark = {
                                    title: instance.legislationName,
                                    summary: instance.preamble,
                                    sourceId: instance.id,
                                    type: 'legislation'
                                }
                                if (customer.bookmarks == undefined) { customer.bookmarks = [] }
                                var found = 0
                                customer.bookmarks.forEach(function(bookmark) {
                                    if (bookmark.sourceId == sourceId) {
                                        found++
                                        customer.bookmarks.splice(customer.bookmarks.indexOf(bookmark), 1)
                                        customer.save(function(err) {
                                            if (err) {
                                                cb(err)
                                            } else {
                                                console.log(instance.name)
                                                console.log(customer.firstName)
                                                cb(null, customer)
                                            }
                                        })
                                    }
                                })
                                if (found == 0) {
                                    customer.bookmarks.push(bookmark)
                                    customer.save(function(err) {
                                        if (err) {
                                            cb(err)
                                        } else {
                                            console.log(instance.name)
                                            console.log(customer.firstName)
                                            cb(null, customer)
                                        }
                                    })
                                }
                            }
                        })
                }
            })
        }
    }

    /**
     * Add Bookmarks
     * @param {String} id 
     * @callback {Function} cb The callback function
     */
    Customer.bookmarks = function(username, cb) {
            var app = Customer.app
            var Case = app.models.Case

            /*function callback(err, customer) {
                Loan.find({ where: { customerId: customer.id, status: { neq: "disbursed" } } }, function(err, loans) {
                    var aCustomer = {}
                    aCustomer = customer
                    aCustomer.currentLoans = loans
                    console.info('Customer', aCustomer)
                    cb(null, aCustomer)
                })
            }*/

            this.findOne({ where: { phoneNumber: username } }, function(err, customer) {
                if (customer == null) {
                    cb(err, null)
                } else {
                    var lastAccess = new Date(Date.now())
                    customer.lastAccess = lastAccess;
                    customer.save();
                    if (customer.bookmarks == undefined) { customer.bookmarks = [] }
                    cb(null, customer.bookmarks)
                }
            })
        }
        //


    Customer.beforeRemote('create', function(context, customer, next) {
        var app = Customer.app;
        var Appuser = app.models.Appuser;
        var Subscription = app.models.Subscription;
        var count = 0;


        function callback() {
            if (count == 1) {
                next()
            }
            count++
        }
        var customer = context.req.body;
        Appuser.create({ username: customer.phoneNumber.replace("+", ""), email: customer.emailAddress, password: customer.password, pwd: customer.password, firstname: customer.firstName, lastname: customer.lastName, customerId: customer.id }, function(err, user) {
            if (err) {
                console.log('err occured', err)
                next(err, null)
            } else if (user) {
                console.log('user has been saved', user)
                Subscription.createTrial((err, subscription) => {
                    if (err) {
                        console.log("Error creating subscription")
                    } else if (subscription) {
                        user.currentSubscription = subscription.id;
                        user.save();
                        console.log("subscription assigned");
                        next()
                    }
                })

            }

            // callback()

        })

    })


    Customer.observe('before save', function removePlusFromPhoneNumber(ctx, next) {
        if (ctx.instance) {
            ctx.instance.phoneNumber = ctx.instance.phoneNumber.replace("+", "")
        } else {
            //ctx.data.updated = new Date();
        }
        next();
    });

}