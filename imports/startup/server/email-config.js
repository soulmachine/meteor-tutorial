Accounts.emailTemplates.siteName = "AwesomeSite";
Accounts.emailTemplates.from = "AwesomeSite Admin <no-replay@example.com>";

// Welcome email after enrolled
Accounts.emailTemplates.enrollAccount.from = function() {
  return "AwesomeSite Admin <admin@example.com>";
}
Accounts.emailTemplates.enrollAccount.subject = function (user) {
  return "Welcome to Awesome Town, " + user.username;
};
Accounts.emailTemplates.enrollAccount.text = function (user, url) {
  return "You have been selected to participate in building a better future!"
    + " To activate your account, simply click the link below:\n\n"
    + url;
};

// Reset password E-mail
Accounts.emailTemplates.resetPassword.from = function() {
  return "AwesomeSite Admin <no-replay@example.com>";
}
Accounts.emailTemplates.resetPassword.subject = function (user) {
  return "How to reset your password on " + Meteor.absoluteUrl();
};
Accounts.emailTemplates.resetPassword.text = function (user, url) {
  url = url.replace('#/', '');
  return "Hello " + user.username + ",\n\nTo reset your password, simply click the link below.\n\n" + url + "\n\nThanks.";
};
