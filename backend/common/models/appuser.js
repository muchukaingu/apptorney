var loopback = require('../../node_modules/loopback/lib/loopback')
var config = require('../../server/config.json')
var path = require('path')
var utils = require('../../node_modules/loopback/lib/utils')
var SALT_WORK_FACTOR = 10
var crypto = require('crypto')
var assert = require('assert')
var debug = require('debug')
const Nexmo = require('nexmo')
    //var dateFormat = require('dateformat');

// const nexmo = new Nexmo({
//     apiKey: '3e93649c',
//     apiSecret: '653d2073d5b7e9b1'
// })

var accountSid = 'ACba8ec0e4fa56209de7a4154e1f7d4ca8'; // Your Account SID from www.twilio.com/console
var authToken = '8efb8cbb2fd3f4f5b76c1ca8eec435f4'; // Your Auth Token from www.twilio.com/console
var messagingServiceSid = 'MG587973a6cc592b7694e19295c4897e73';

var twilio = require('twilio')
var client = new twilio(accountSid, authToken)

module.exports = function(Appuser) {

    /**
     * Login a user by with the given `credentials`.
     *
     * ```js
     *    User.login({username: 'foo', password: 'bar'}, function (err, token) {
     *      console.log(token.id)
     *    })
     * ```
     *
     * @param {Object} credentials username/password or email/password
     * @param {String[]|String} [include] Optionally set it to "user" to include
     * the user info
     * @callback {Function} callback Callback function
     * @param {Error} err Error object
     * @param {AccessToken} token Access token if login is successful
     */

    Appuser.login = function(credentials, include, fn) {
        var self = this
        if (typeof include === 'function') {
            fn = include
            include = undefined
        }

        fn = fn || utils.createPromiseCallback()

        include = (include || '')
        if (Array.isArray(include)) {
            include = include.map(function(val) {
                return val.toLowerCase()
            })
        } else {
            include = include.toLowerCase()
        }

        var realmDelimiter
            // Check if realm is required
        var realmRequired = !!(self.settings.realmRequired ||
            self.settings.realmDelimiter)
        if (realmRequired) {
            realmDelimiter = self.settings.realmDelimiter
        }
        var query = self.normalizeCredentials(credentials, realmRequired,
            realmDelimiter)

        if (realmRequired && !query.realm) {
            var err1 = new Error('realm is required')
            err1.statusCode = 400
            err1.code = 'REALM_REQUIRED'
            fn(err1)
            return fn.promise
        }
        if (!query.email && !query.username) {
            var err2 = new Error('username or email is required')
            err2.statusCode = 400
            err2.code = 'USERNAME_EMAIL_REQUIRED'
            fn(err2)
            return fn.promise
        }

        self.findOne({ where: query }, function(err, user) {
            var defaultError = new Error('login failed')
            defaultError.statusCode = 401
            defaultError.code = 'LOGIN_FAILED'

            function tokenHandler(err, token) {
                if (err) return fn(err)
                if (Array.isArray(include) ? include.indexOf('user') !== -1 : include === 'user') {
                    // NOTE(bajtos) We can't set token.user here:
                    //  1. token.user already exists, it's a function injected by
                    //     "AccessToken belongsTo User" relation
                    //  2. ModelBaseClass.toJSON() ignores own properties, thus
                    //     the value won't be included in the HTTP response
                    // See also loopback#161 and loopback#162
                    token.__data.user = user
                }
                fn(err, token)
            }

            if (err) {
                debug('An error is reported from User.findOne: %j', err)
                fn(defaultError)
            } else if (user) {
                user.hasPassword(credentials.password, function(err, isMatch) {
                    if (err) {
                        debug('An error is reported from User.hasPassword: %j', err)
                        fn(defaultError)
                    } else if (isMatch) {
                        if (!user.phoneVerified) {
                            // Fail to log in if email verification is not done yet
                            debug('User phone number has not been verified')
                            err = new Error('login failed as the phone number has not been verified')
                            err.statusCode = 405
                            err.code = 'LOGIN_FAILED_PHONE_NOT_VERIFIED'
                            fn(err)
                        } else {
                            var lastLogin = new Date(Date.now())
                            user.lastLogin = lastLogin;
                            user.save();
                            if (user.createAccessToken.length === 2) {
                                user.createAccessToken(credentials.ttl, tokenHandler)
                            } else {
                                user.createAccessToken(credentials.ttl, credentials, tokenHandler)
                            }
                        }
                    } else {
                        debug('The password is invalid for user %s', query.email || query.username)
                        fn(defaultError)
                    }
                })
            } else {
                debug('No matching record is found for user %s', query.email || query.username)
                fn(defaultError)
            }
        })
        return fn.promise
    }

    /**
     * Confirm the user's phone number.
     *
     * @param {Any} userId
     * @param {String} token The validation token
     * @param {String} redirect URL to redirect the user to once confirmed
     * @callback {Function} callback
     * @param {Error} err
     */
    Appuser.confirmPhone = function(username, token, fn) {
        fn = fn || utils.createPromiseCallback()
        this.findOne({ where: { username: username } }, function(err, user) {
            if (err) {
                fn(err)
            } else {
                if (user && user.verificationTokenForPhone === token) {
                    user.verificationTokenForPhone = undefined
                    user.phoneVerified = true
                    user.save(function(err) {
                        if (err) {
                            fn(err)
                        } else {
                            fn()
                        }
                    })
                } else {
                    if (user) {
                        err = new Error('Invalid token: ' + token + 'expecting ' + user.verificationTokenForPhone)
                        err.statusCode = 400
                        err.code = 'INVALID_TOKEN'
                        err.user = user
                    } else {
                        err = new Error('User not found')
                        err.statusCode = 404
                        err.code = 'USER_NOT_FOUND'
                    }
                    fn(err)
                }
            }
        })
        return fn.promise
    }



    /**
     * Confirm the user's phone number.
     *
     * @param {Any} userId
     * @param {String} token The validation token
     * @param {String} redirect URL to redirect the user to once confirmed
     * @callback {Function} callback
     * @param {Error} err
     */
    Appuser.resetPasswordWithOTP = function(username, password, token, fn) {
        fn = fn || utils.createPromiseCallback()
        this.findOne({
            where: {
                username: username
            }
        }, function(err, user) {
            if (err) {
                fn(err)
            } else {
                if (user && user.passwordResetToken === token) {
                    user.passwordResetToken = undefined
                        //
                    user.password = password;
                    user.save(function(err) {
                        if (err) {
                            fn(err)
                        } else {
                            fn(true)
                        }
                    })
                } else {

                    if (user) {
                        console.log("error occured!")
                        err = new Error('Invalid token: ' + token + 'expecting ' + user.verificationTokenForPhone)
                        err.statusCode = 400
                        err.code = 'INVALID_TOKEN'
                        err.user = user
                    } else {
                        err = new Error('User not found')
                        err.statusCode = 404
                        err.code = 'USER_NOT_FOUND'
                    }
                    fn(err)
                }
            }
        })
        return fn.promise
    }



    /**
     * Confirm the user's phone number.
     *
     * @param {Any} userId
     * @param {String} token The validation token
     * @param {String} redirect URL to redirect the user to once confirmed
     * @callback {Function} callback
     * @param {Error} err
     */
    Appuser.requestPasswordReset = function(username, fn) {
        console.log('reset fn')


        fn = fn || utils.createPromiseCallback()

        var user = this

        var userModel = this.constructor
        var registry = userModel.registry
            // var User = registry.getModelByType(loopback.User)

        // Set a default token generation function if one is not provided
        var tokenGenerator = Appuser.generateVerificationToken
        tokenGenerator(user, function(err, token) {
            if (err) {
                return fn(err);
            }


            Appuser.findOne({ where: { username: username } }, (err, user) => {
                user.passwordResetToken = Math.floor(Math.random() * 1000000 + 1)
                console.log("xxx is for you")
                user.save(function(err) {
                    if (err) {
                        fn(err)
                    } else {
                        sendSMS(user)
                        return fn();
                    }
                })
            })

        })


        function sendSMS(user) {
            /* 
              nexmo.message.sendSms('apptorney', user.username, 'Your verification code: ' + user.verificationTokenForPhone, (err, res) => {
             console.log('err', err)
              })*/

            client.messages.create({
                body: 'Password reset code: ' + user.passwordResetToken,
                // body: 'Thank you for your registration. Apptorney will be available for download on April 30, 2018. Please check your email for more details.',
                to: user.username, // Text this number
                //from: 'Apptorney' // From a valid Twilio number
                messagingServiceSid: messagingServiceSid
            }).then((message) => console.log(message.sid))

        }
    }

    /**
     * Resend verification code
     *
     * @param {String} username
     * @callback {Function} fn
     */
    Appuser.resendVerification = function(username, fn) {
        fn = fn || utils.createPromiseCallback()

        this.findOne({ where: { username: username } }, function(err, user) {
            console.log(user, err)
            if (user == null) {
                var err = new Error('User not found')
                err.statusCode = 404
                err.code = 'USER_NOT_FOUND'
                fn(err)
            } else if (err) {
                fn(err)
            } else {
                console.log(user)
                var tokenGenerator = Appuser.generateVerificationToken
                tokenGenerator(user, function(err, token) {
                    if (err) { return fn(err); }
                    user.verificationTokenForPhone = Math.floor(Math.random() * 1000000 + 1)
                    user.save(function(err) {
                        if (err) {
                            fn(err)
                        } else {
                            sendSMS(user)
                            fn()
                        }
                    })
                })
            }
        })

        function sendSMS(user) {
            client.messages.create({
                body: 'Your verification code: ' + user.verificationTokenForPhone,
                //body: 'Thank you for your registration. Apptorney will be available for download on April 30, 2018. Please check your email for more details.',
                to: user.username, // Text this number
                messagingServiceSid: messagingServiceSid
            }).then((message) => console.log(message.sid))
        }
        return fn.promise
    }

    // ---Trigger notifications---->

    /**
     * Trigger notifications
     *
     * @param {String} username
     * @callback {Function} fn
     */
    Appuser.notifications = function(fn) {
        fn = fn || utils.createPromiseCallback()
        var app = Appuser.app;
        var Email = app.models.Email;
        var options = {
            type: 'email',
            host: 'localhost',
            port: '3000',
            to: '',
            contact_number: '',
            password: '',
            from: 'Apptorney<noreply@apptorney.org>',
            subject: 'Apptorney',
            signature: 'The Apptorney Team',
            template: path.resolve(__dirname, '../../server/views/bulk.ejs'),
            redirect: 'http://localhost/competitions/#/login?verified=true',
            user: {}
        }

        this.find({}, function(err, users) {
            users.forEach(user => {
                options.to = user.email
                options.contact_number = user.username
                options.password = user.pwd
                options.user = user
                sendSMS(user)
                sendEmail(user)
            })

            fn(users.length)
        })

        function sendSMS(user) {
            client.messages.create({
                // body: 'Your verification code: ' + user.verificationTokenForPhone,
                body: 'Download Apptorney from the Appstore and Playstore today and start your free trial.',
                to: user.username, // Text this number
                from: 'Apptorney' // From a valid Twilio number
            }).then((message) => console.log(message.sid))
        }

        function sendEmail(user) {
            options.verifyHref += '&token=' + user.verificationToken
            options.text = options.text || 'Please verify your email by opening this link in a web browser:\n\t{href}'
            options.text = options.text.replace('{href}', options.verifyHref)
            options.to = options.to || user.email
            options.fullname = user.firstname + ' ' + user.lastname
            options.subject = options.subject || 'Apptorney'
            options.headers = options.headers || {}
            var template = loopback.template(options.template)
            options.html = template(options)
            Email.send(options, function(err, email) {
                if (err) {
                    console.log(err)
                } else {
                    console.log('Email sent to ', email)
                }
            })
        }
        return fn.promise
    }



    function formatDate(date) {
        var options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return date.toLocaleDateString("en-US", options);
    }

    // ----------------End----->

    Appuser.prototype.verify = function(options, fn) {
        console.log('verify fn')
        var Subscription = Appuser.app.models.Subscription;
        var expiryDate = new Date();

        fn = fn || utils.createPromiseCallback()

        var user = this


        var userModel = this.constructor
        var registry = userModel.registry
        assert(typeof options === 'object', 'options required when calling user.verify()')
        assert(options.type, 'You must supply a verification type (options.type)')
        assert(options.type === 'email', 'Unsupported verification type')
        assert(options.to || this.email, 'Must include options.to when calling user.verify() or the user must have an email property')
        assert(options.from, 'Must include options.from when calling user.verify()')

        options.redirect = options.redirect || '/'
        options.template = path.resolve(options.template || path.join(__dirname, '..', '..', 'templates', 'verify.ejs'))
        options.user = this
        options.protocol = options.protocol || 'http'

        var app = userModel.app
        options.host = options.host || (app && app.get('host')) || 'localhost'
        options.port = options.port || (app && app.get('port')) || 3000
        options.restApiRoot = options.restApiRoot || (app && app.get('restApiRoot')) || '/api'
        var expiryDate = new Date(Date.now());
        expiryDate.setDate(expiryDate.getDate() + 30);
        options.expiryDate = formatDate(expiryDate);

        var displayPort = (
            (options.protocol === 'http' && options.port == '80') ||
            (options.protocol === 'https' && options.port == '443')
        ) ? '' : ':' + options.port

        options.verifyHref = options.verifyHref ||
            options.protocol +
            '://' +
            options.host +
            displayPort +
            options.restApiRoot +
            userModel.http.path +
            userModel.sharedClass.find('confirm', true).http.path +
            '?uid=' +
            options.user.id +
            '&redirect=' +
            options.redirect

        // Email model
        var Email = options.mailer || this.constructor.email || registry.getModelByType(loopback.Email)
        var User = registry.getModelByType(loopback.User)

        // Set a default token generation function if one is not provided
        var tokenGenerator = options.generateVerificationToken || User.generateVerificationToken

        tokenGenerator(user, function(err, token) {
            if (err) { return fn(err); }

            user.verificationToken = token
            user.save(function(err) {
                if (err) {
                    fn(err)
                } else {
                    sendEmail(user)
                }
            })
        })

        tokenGenerator(user, function(err, token) {
            if (err) { return fn(err); }

            user.verificationTokenForPhone = Math.floor(Math.random() * 1000000 + 1)
            user.save(function(err) {
                if (err) {
                    fn(err)
                } else {
                    sendSMS(user)
                }
            })
        })

        // TODO - support more verification types
        function sendEmail(user) {
            options.verifyHref += '&token=' + user.verificationToken

            options.text = options.text || 'Please verify your email by opening this link in a web browser:\n\t{href}'

            options.text = options.text.replace('{href}', options.verifyHref)

            options.to = options.to || user.email

            options.fullname = user.firstname + ' ' + user.lastname

            options.subject = options.subject || 'Thanks for Registering'

            options.headers = options.headers || {}

            var template = loopback.template(options.template)
            options.html = template(options)

            Email.send(options, function(err, email) {
                if (err) {
                    fn(err)
                } else {
                    fn(null, { email: email, token: user.verificationToken, uid: user.id })
                }
            })
        }

        function sendSMS(user) {
            /* 
              nexmo.message.sendSms('apptorney', user.username, 'Your verification code: ' + user.verificationTokenForPhone, (err, res) => {
             console.log('err', err)
              })*/

            client.messages.create({
                body: 'Your verification code: ' + user.verificationTokenForPhone,
                // body: 'Thank you for your registration. Apptorney will be available for download on April 30, 2018. Please check your email for more details.',
                to: user.username, // Text this number
                //from: 'Apptorney' // From a valid Twilio number
                messagingServiceSid: messagingServiceSid
            }).then((message) => console.log(message.sid))

        }
        return fn.promise
    }

    // send verification email after registration
    Appuser.afterRemote('create', function(context, user, next) {
        console.log('> user.afterRemote triggered')

        var options = {
            type: 'email',
            host: 'localhost',
            port: '3000',
            to: user.email,
            contact_number: user.contact_number,
            password: context.args.data.password,
            from: 'Apptorney<noreply@apptorney.org>',
            subject: 'Verify Your Email',
            // text: 'Thank you for registering an account on the '+user.competitionName+' website. Your account will enable you to login and apply for the '+user.competitionName+'. Please now take the time to click on the Verify button below, login and fill out the '+user.competitionName+' Business Model Submission Form. Filling out this business model form will officially enter your business into the competition.',
            signature: 'The Apptorney Team',
            template: path.resolve(__dirname, '../../server/views/verify.ejs'),
            // redirect: 'http://' + config.host + ':' +  '3000/#/login?verified=true',
            redirect: 'http://' + user.location + '/competitions/#/login?verified=true',
            user: user
        }

        user.verify(options, function(err, response) {
            if (err) {
                Appuser.deleteById(user.id)
                return next(err)
            }

            console.log('> Password:', context.args.data.password)
            console.log('> verification email sent:', response)

            /*context.res.status('response', {
              title: 'Signed up successfully',
              content: 'Please check your email and click on the verification link ' +
                  'before logging in.',
              redirectTo: '/',
              redirectToLinkText: 'Log in'
            });*/

            next()
        })
    })

    Appuser.resetPassword = function(options, cb) {
        cb = cb || utils.createPromiseCallback();
        var UserModel = this;
        var ttl = UserModel.settings.resetPasswordTokenTTL || DEFAULT_RESET_PW_TTL;

        options = options || {};
        if (typeof options.email !== 'string') {
            var err = new Error('Email is required');
            err.statusCode = 400;
            err.code = 'EMAIL_REQUIRED';
            cb(err);
            return cb.promise;
        }

        UserModel.findOne({
            where: {
                email: options.email
            }
        }, function(err, user) {
            if (err) {
                return cb(err);
            }
            if (!user) {
                err = new Error('Email not found');
                err.statusCode = 404;
                err.code = 'EMAIL_NOT_FOUND';
                return cb(err);
            }
            // create a short lived access token for temp login to change password
            // TODO(ritch) - eventually this should only allow password change
            user.accessTokens.create({
                ttl: ttl
            }, function(err, accessToken) {
                if (err) {
                    return cb(err);
                }
                cb();
                UserModel.emit('resetPasswordRequest', {
                    email: options.email,
                    accessToken: accessToken,
                    user: user
                });
            });
        });

        return cb.promise;
    };



    // send password reset link when requested
    Appuser.on('resetPasswordRequest', function(info) {





        /*
        var options = {
                type: 'email',
                to: info.email,
                firstname: info.user.firstname,
                from: 'noreply@loopback.com',
                subject: 'Reset your password.',
                text: 'A request was made to reset your password on the ' + info.user.competitionName + ' Website. If you made this request, proceed to click the Reset button below. If not, please ignore this email.',
                template: path.resolve(__dirname, '../../server/views/reset.ejs')
            }
            // var url = 'http://' + config.host + ':' +  '3000/#/reset'
        var url = 'http://' + info.user.location + '/competitions/#/reset'
        options.resetHref = url + '?access_token=' + info.accessToken.id
        console.log(info.accessToken.id)
        var template = loopback.template(options.template)
        options.html = template(options)

        Appuser.app.models.Email.send(options, function(err) {
            if (err) return console.log('> error sending password reset email')
            console.log('> sending password reset email to:', info.email)
        })*/
    })



    Appuser.observe('after save', function(context, next) {
        if (context.isNewInstance) {
            context.isNewInstance = false
            console.log('> user.afterRemote triggered', 'xxx')
            var user = context.instance

            var options = {
                type: 'email',
                host: 'localhost',
                port: '3000',
                to: user.email,
                contact_number: user.username,
                password: user.pwd,
                from: 'Apptorney<noreply@apptorney.org>',
                subject: 'Email Confirmation',
                // text: 'Thank you for registering an account on the '+user.competitionName+' website. Your account will enable you to login and apply for the '+user.competitionName+'. Please now take the time to click on the Verify button below, login and fill out the '+user.competitionName+' Business Model Submission Form. Filling out this business model form will officially enter your business into the competition.',
                signature: 'The Apptorney Team',
                template: path.resolve(__dirname, '../../server/views/verify.ejs'),
                // redirect: 'http://' + config.host + ':' +  '3000/#/login?verified=true',
                redirect: 'http://' + user.location + '/competitions/#/login?verified=true',
                user: user
            }

            user.verify(options, function(err, response) {
                if (err) {
                    Appuser.deleteById(user.id)
                    return next(err)
                }

                console.log('> Password:', user.password)
                console.log('> verification email sent:', response)

                /*context.res.status('response', {
                  title: 'Signed up successfully',
                  content: 'Please check your email and click on the verification link ' +
                      'before logging in.',
                  redirectTo: '/',
                  redirectToLinkText: 'Log in'
                });*/

                next()
            })
        } else {
            next()
        }
    })

    Appuser.remoteMethod(
        'confirmPhone', {
            description: 'Confirm a user phone number with verification code.',
            accepts: [
                { arg: 'username', type: 'string', required: true },
                { arg: 'token', type: 'number', required: true }

            ],
            http: { verb: 'get', path: '/confirmPhone' }
        }
    )

    Appuser.remoteMethod(
        'resetPasswordWithOTP', {
            description: 'Reset a password with OTP.',
            accepts: [{
                    arg: 'username',
                    type: 'string',
                    required: true
                },
                {
                    arg: 'password',
                    type: 'string',
                    required: true
                },
                {
                    arg: 'token',
                    type: 'number',
                    required: true
                }

            ],
            http: {
                verb: 'get',
                path: '/resetPasswordWithOTP'
            }
        }
    )



    Appuser.remoteMethod(
        'requestPasswordReset', {
            description: 'Allows a user to reset a password with an OTP',
            accepts: [{
                    arg: 'username',
                    type: 'string',
                    required: true
                }

            ],
            http: {
                verb: 'get',
                path: '/requestPasswordReset'
            }
        }
    )

    Appuser.remoteMethod(
        'resendVerification', {
            description: 'Resends verification code via SMS',
            accepts: [
                { arg: 'username', type: 'string', required: true }
            ],
            http: { verb: 'get', path: '/resendVerification' }
        }
    )

    Appuser.remoteMethod(
        'notifications', {
            description: 'Manually sends notifications to all cuatomers',
            returns: { arg: 'users', type: '' },
            http: { verb: 'get', path: '/notifications' }
        }
    )

    Appuser.remoteMethod(
        'performance', {
            http: { path: '/performance', verb: 'get' },
            returns: { arg: 'performance', type: '[{}]' }
        })

    Appuser.performance = function(cb) {
        Appuser.find({}, function(err, users) {
            cb(null, users)
        })
    }
}