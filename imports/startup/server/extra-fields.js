Accounts.onCreateUser(function(options, user) {
  return _.extend(user, {gender: options.profile.gender, birthyear: options.profile.birthyear});
});
