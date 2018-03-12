module.exports = function(Customer) {
    Customer.validatesUniquenessOf('emailAddress', { message: 'Customer with this email address already exists' })
    Customer.validatesUniquenessOf('phoneNumber', { message: 'Customer with this phone number already exists' })
        // var loan = {};
    Customer.remoteMethod(
            'summary', {
                http: { path: '/summary', verb: 'get' },
                accepts: { arg: 'id', type: 'string' },
                returns: { arg: 'summary', type: 'Object' }
            })
        /**
         * Shows completion summary of legislations
         *
         * @callback {Function} cb The callback function
         */
    Customer.summary = function(id, cb) {
            var app = Customer.app
                //var Loan = app.models.LoanTransaction

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
                    //callback(null, customer)
                    cb(null, customer)
                })
        }
        /*
        Customer.beforeRemote('create', function(context, customer, next) {
            var customer = context.req.body;
            loan = customer.loanDetails;
            context.req.body.loanDetails = undefined;
            next()
        })
        */

    Customer.afterRemote('create', function(context, customer, next) {
        var app = Customer.app
        var Appuser = app.models.Appuser
            // var LoanTransaction = app.models.LoanTransaction
        var count = 0;

        function callback() {
            if (count == 1) {
                next()
            }
            count++
        }

        Appuser.create({ username: customer.phoneNumber, email: customer.emailAddress, password: customer.password, pwd: customer.password, firstname: customer.firstName, lastname: customer.lastName, customerId: customer.id }, function(err, user) {
            console.log('user has been saved', user)
            console.log('err occured', err)
                //callback()
            next()
        });
        /*
        LoanTransaction.create({
                amount: loan.loanAmount,
                tenure: loan.tenure,
                monthlyInterest: loan.interestRate,
                monthlyPayment: loan.monthlyPayment,
                status: "pending",
                customerId: customer.id
            },
            function(err, loan) {
                console.log(loan)
                callback();
            }
        )*/
    })



}