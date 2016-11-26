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
      nickname: 1,
    }
  });
}, { is_auto: true });

// Deny all client-side updates to user documents
Meteor.users.deny({
  update() { return true; }
});
