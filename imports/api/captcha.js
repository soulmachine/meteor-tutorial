import { Meteor } from 'meteor/meteor';

function verifyCaptcha(clientIP, response) {
  var captcha_data = {
    secret: Meteor.settings.secretKey,
    remoteip: clientIP,
    response: response
  };

  var serialized_captcha_data =
    'secret=' + captcha_data.secret +
    '&remoteip=' + captcha_data.remoteip +
    '&response=' + captcha_data.response;
  var captchaVerificationResult;
  var success = false; // used to process response string

  try {
    captchaVerificationResult = HTTP.call("POST", "https://www.google.com/recaptcha/api/siteverify", {
      content: serialized_captcha_data.toString('utf8'),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': serialized_captcha_data.length
      }
    });
  } catch (e) {
    console.log(e);
    return {
      'success': false,
      'error': 'Service Not Available'
    };
  }

  if (!captchaVerificationResult || !captchaVerificationResult.content) {
    return {
      'success': false,
      'error': 'Entered Text Does Not Match'
    };
  }

  captchaVerificationResult = EJSON.parse(captchaVerificationResult.content);
  return captchaVerificationResult;
}

Meteor.methods({
  "verifyCaptcha": function(response) {
    var verifyCaptchaResponse = verifyCaptcha(this.connection.clientAddress, response);
    if (!verifyCaptchaResponse.success) {
      console.log('Captcha verification failed! Responding with: ', verifyCaptchaResponse);
      return verifyCaptchaResponse;
    } else {
      console.log('Captcha verification passed!')
    }
    return verifyCaptchaResponse.success;
  },
});

