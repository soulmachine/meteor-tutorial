Accounts.onCreateUser(function(options, user) {
  return _.extend(user, {gender: options.profile.gender, birthyear: options.profile.birthyear});
});

Meteor.publish(null, function () {
  return Meteor.users.find({
    _id: this.userId
  }, {
    fields: {
      birthyear: 1,
      gender: 1,
    }
  });
}, { is_auto: true });
