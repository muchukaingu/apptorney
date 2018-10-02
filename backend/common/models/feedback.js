var loopback = require('../../node_modules/loopback/lib/loopback')
var path = require('path')


module.exports = function(Feedback) {
    Feedback.observe('after save', function(context, next) {
        if (context.isNewInstance) {
            context.isNewInstance = false
            var feedback = context.instance
            feedback.date = Date.now();

            var app = Feedback.app;
            var Email = app.models.Email;
            var Appuser = app.models.Appuser;

            Appuser.findById(feedback.appuserId, (err, user) => {



                var options = {
                    type: 'email',
                    host: 'localhost',
                    port: '3000',
                    to: '',
                    contact_number: '',
                    password: '',
                    from: 'Apptorney<noreply@apptorney.org>',
                    subject: 'Thank you for your feedback.',
                    signature: 'The Apptorney Team',
                    template: path.resolve(__dirname, '../../server/views/feedback.ejs'),
                    user: {}
                }

                sendEmail(user)


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


                next()
            })

        } else {
            next()
        }
    })

};