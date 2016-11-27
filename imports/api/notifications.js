import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Notifications = new Mongo.Collection('notifications');

if (Meteor.isServer) {
  Meteor.publish('notifications', function(skipCount) {
    console.log("skipCount: ", skipCount);
    return Notifications.find({owner: this.userId},
      {sort: {createdAt : -1}, skip: skipCount, limit: parseInt(Meteor.settings.public.recordsPerPage)});
  });

  Meteor.publish('notification-unread-count', function() {
    return new Counter('notification-unread-count', Notifications.find({owner: this.userId, isRead: { $ne: true }}));
  });
  Meteor.publish('notification-total-count', function() {
    return new Counter('notification-total-count', Notifications.find({owner: this.userId}));
  });
}

Meteor.methods({
  'notification.markAsRead'(id) {
    const notification = Notifications.findOne(id);
    if (notification.owner !== this.userId) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }

    Notifications.update(id, { $set: { isRead: true } });
  },
});
