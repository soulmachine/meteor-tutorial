import verifyCaptcha from '../../api/captcha.js';

Accounts.onCreateUser(function (options, user) {
  let ip;
  if (this.connection == null || this.connection.clientAddress == null) {  // for local debug only
    const response = HTTP.call("GET", "http://checkip.dyndns.org");
    const match =  response.content.match(/.*Current IP Address: ([0-9.]+)/i);
    ip = match[1];
  } else {
    ip = this.connection.clientAddress;
  }
  const verifyCaptchaResponse = verifyCaptcha(ip, options.profile.captcha);
  if (!verifyCaptchaResponse.success) {
    throw new Meteor.Error('reCAPTCHA validation failed');
  }
  return _.extend(user,
    { password: options.password,
      email: options.email,
      gender: options.profile.gender,
      birthyear: options.profile.birthyear,
      ip,
    }
  );
});

Meteor.publish(null, function () {
  if (this.userId) {
    return Meteor.users.find(this.userId,
      {
        fields: {
          birthyear: 1,
          gender: 1,
          nickname: 1,
        }
      });
  } else {
    return this.ready();
  }
});

// Deny all client-side updates to user documents
Meteor.users.deny({
  update() {
    return true;
  }
});
