import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Notifications = new Mongo.Collection('notifications');

if (Meteor.isServer) {
  Meteor.publish('notification-unread-count', function() {
    return new Counter('notification-unread-count', Notifications.find({owner: this.userId, isRead: { $ne: true }}));
  });
}
