import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Notifications = new Mongo.Collection('notifications');

if (Meteor.isServer) {
  Meteor.publish('notifications', function(skipCount) {
    Counts.publish(this, 'notifications-counter',
      Notifications.find({owner: this.userId, isRead: { $ne: true }}),
      { noReady: true}
    );
    return Notifications.find({owner: this.userId},
      {sort: {createdAt : -1}, skip: skipCount, limit: parseInt(Meteor.settings.public.recordsPerPage) });
  });
}
