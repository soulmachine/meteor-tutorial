import { Meteor } from 'meteor/meteor';


Meteor.methods({
  'usernameExists'(username) {
    return (Meteor.users.findOne({username: username})) ? true : false;
  },
  'emailExists' (email) {
    return Meteor.users.find({"emails.address": email}, {limit: 1}).count() > 0;
  }
});
