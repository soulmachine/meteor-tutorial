import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
  Meteor.methods({
    'usernameExists'(username) {
      return (Meteor.users.findOne({username: username})) ? true : false;
    },
    'emailExists' (email) {
      return (Meteor.users.findOne({"emails.address": email})) ? true : false;
    },
    'user.updateNickname' (nickname) {
      Meteor.users.update(Meteor.userId(), {$set: {nickname: nickname}});
    }
  });
}
