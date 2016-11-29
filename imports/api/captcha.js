import { Meteor } from 'meteor/meteor';

function verifyCaptcha(clientIP, response) {
  const captcha_data = {
    secret: Meteor.settings.reCAPTCHASecretKey,
    remoteip: clientIP,
    response: response
  };

  const serialized_captcha_data =
    'secret=' + captcha_data.secret +
    '&remoteip=' + captcha_data.remoteip +
    '&response=' + captcha_data.response;
  let captchaVerificationResult;

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

export default verifyCaptcha;

Meteor.methods({
  "verifyCaptcha": function(response) {
    var verifyCaptchaResponse = verifyCaptcha(this.connection.clientAddress, response);
    if (!verifyCaptchaResponse.success) {
      console.log('Captcha verification failed! Responding with: ', verifyCaptchaResponse);
    }
    return verifyCaptchaResponse.success;
  },
});
