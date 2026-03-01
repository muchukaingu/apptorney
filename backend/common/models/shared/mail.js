const mailgun = require("mailgun-js");
module.exports.sendEmail = function (recipient, subject, template, values) {
  const DOMAIN = "mg.apptorney.org";
  const mg = mailgun({
    apiKey: "bb9112c75588d7294dddd31c539df299-77751bfc-f4281491",
    domain: DOMAIN
  });
  const data = {
    from: "Apptorney <postmaster@mg.apptorney.org>",
    to: recipient,
    subject: subject,
    template: template,
    "h:X-Mailgun-Variables": JSON.stringify(values)
  };

  //console.log(data);
  mg.messages().send(data, function (error, body) {
    //console.log("err", error);
    //console.log("email", body);
  });
};

module.exports.sendOtpEmail = function (recipient, otp) {
  var DOMAIN = "mg.apptorney.org";
  var mg = mailgun({
    apiKey: "bb9112c75588d7294dddd31c539df299-77751bfc-f4281491",
    domain: DOMAIN
  });
  var data = {
    from: "Apptorney <postmaster@mg.apptorney.org>",
    to: recipient,
    subject: "Your Apptorney verification code",
    text: "Your verification code is: " + otp + "\n\nThis code expires in 10 minutes.\n\nIf you didn't request this code, please ignore this email.\n\n- The Apptorney Team"
  };

  mg.messages().send(data, function (error, body) {
    if (error) {
      console.log("OTP email error:", error);
    }
  });
};
