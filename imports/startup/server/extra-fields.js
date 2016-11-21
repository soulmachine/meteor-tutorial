Accounts.onCreateUser(function(options, user) {
  return _.extend(user, {...options});
});
