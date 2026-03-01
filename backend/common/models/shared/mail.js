var https = require('https')

var RESEND_API_KEY = process.env.RESEND_API_KEY
var FROM_EMAIL = 'Apptorney <noreply@notifications.apptorney.ai>'

function sendWithResend(emailData) {
  var postData = JSON.stringify({
    from: FROM_EMAIL,
    to: Array.isArray(emailData.to) ? emailData.to : [emailData.to],
    subject: emailData.subject,
    html: emailData.html || undefined,
    text: emailData.text || undefined
  })

  var options = {
    hostname: 'api.resend.com',
    path: '/emails',
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + RESEND_API_KEY,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  }

  var req = https.request(options, function (res) {
    var body = ''
    res.on('data', function (chunk) { body += chunk })
    res.on('end', function () {
      if (res.statusCode >= 400) {
        console.log('Resend email error (' + res.statusCode + '):', body)
      }
    })
  })

  req.on('error', function (err) {
    console.log('Resend request error:', err.message)
  })

  req.write(postData)
  req.end()
}

// ── Email templates ──────────────────────────────────────────────────

var TEMPLATES = {
  welcome: function (values) {
    return '<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">' +
      '<h2>Welcome to Apptorney' + (values.firstName ? ', ' + values.firstName : '') + '!</h2>' +
      '<p>Your account has been created successfully.</p>' +
      '<p>You now have access to Zambian case law and legislation at your fingertips.</p>' +
      '<p style="margin-top: 30px;">- The Apptorney Team</p>' +
      '</div>'
  },
  password: function (values) {
    return '<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">' +
      '<h2>Password Reset</h2>' +
      (values.firstName ? '<p>Hi ' + values.firstName + ',</p>' : '') +
      '<p>Your password reset code is:</p>' +
      '<p style="font-size: 24px; font-weight: bold; letter-spacing: 4px; padding: 16px; background: #f4f4f4; text-align: center;">' + (values.otp || '') + '</p>' +
      '<p>This code expires in 10 minutes.</p>' +
      '<p>If you didn\'t request this, please ignore this email.</p>' +
      '<p style="margin-top: 30px;">- The Apptorney Team</p>' +
      '</div>'
  }
}

// ── Exported functions ───────────────────────────────────────────────

module.exports.sendEmail = function (recipient, subject, template, values) {
  var html
  if (TEMPLATES[template]) {
    html = TEMPLATES[template](values || {})
  } else {
    html = '<p>' + JSON.stringify(values || {}) + '</p>'
  }

  sendWithResend({
    to: recipient,
    subject: subject,
    html: html
  })
}

module.exports.sendOtpEmail = function (recipient, otp) {
  sendWithResend({
    to: recipient,
    subject: 'Your Apptorney verification code',
    html: '<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">' +
      '<h2>Verification Code</h2>' +
      '<p>Your verification code is:</p>' +
      '<p style="font-size: 32px; font-weight: bold; letter-spacing: 6px; padding: 20px; background: #f4f4f4; text-align: center;">' + otp + '</p>' +
      '<p>This code expires in 10 minutes.</p>' +
      '<p>If you didn\'t request this code, please ignore this email.</p>' +
      '<p style="margin-top: 30px;">- The Apptorney Team</p>' +
      '</div>'
  })
}

module.exports.sendInviteEmail = function (recipient, organizationName, role, inviteLink) {
  sendWithResend({
    to: recipient,
    subject: "You've been invited to join " + organizationName + " on Apptorney",
    html: '<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">' +
      '<h2>Organization Invitation</h2>' +
      '<p>You have been invited to join <strong>' + organizationName + '</strong> on Apptorney as a <strong>' + role + '</strong>.</p>' +
      '<p><a href="' + inviteLink + '" style="display: inline-block; padding: 12px 24px; background: #2563eb; color: #fff; text-decoration: none; border-radius: 6px;">Accept Invitation</a></p>' +
      '<p style="color: #666; font-size: 14px;">This invitation expires in 7 days.</p>' +
      '<p style="margin-top: 30px;">- The Apptorney Team</p>' +
      '</div>'
  })
}
