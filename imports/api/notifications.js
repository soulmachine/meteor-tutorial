import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Notifications = new Mongo.Collection('notifications');
export const NotificationTotalCounters = new Mongo.Collection('notification_total_counters');
export const NotificationUnreadCounters = new Mongo.Collection('notification_unread_counters');

if (Meteor.isServer) {
  Meteor.publish('notifications', function(skipCount) {
    console.log("skipCount: ", skipCount);
    return Notifications.find({owner: this.userId},
      {sort: {createdAt : -1}, skip: skipCount, limit: parseInt(Meteor.settings.public.recordsPerPage)});
  });
  Meteor.publish('notification_total_counters', function() {
    return NotificationTotalCounters.find({owner: this.userId});
  });
  Meteor.publish('notification_unread_counters', function() {
    return NotificationUnreadCounters.find({owner: this.userId});
  });

  // Initialize counters
  const allNotifications = Notifications.find({}, {fields: {owner: 1, isRead: 1}}).fetch();
  const groupBy = {};
  allNotifications.forEach(function(x, i){
    if (x.owner in groupBy) groupBy[x.owner].push(x);
    else groupBy[x.owner] = [x];
  });

  for (var userId in groupBy) {
    NotificationTotalCounters.update(
      { owner: userId },
      { $set: { owner: userId, count: groupBy[userId].length } },
      { upsert: true },
    );
    NotificationUnreadCounters.update(
      { owner: userId },
      { $set: { owner: userId, count: groupBy[userId].filter(function(x) {return x.isRead != true}).length } },
      { upsert: true },
    );
  }
}

Meteor.methods({
  'notification.insert'(content) {
    Notifications.insert({
      owner: content.owner,
      sender: content.sender,
      action: content.action,
      title: content.title,
      link: content.link,
      createdAt: new Date(),
    });

    NotificationTotalCounters.update(
      { owner: this.userId },
      { $inc: { count: 1 } },
      { upsert: true },
    );
    NotificationUnreadCounters.update(
      { owner: this.userId },
      { $inc: { count: 1 } },
      { upsert: true },
    );
  },
  'notifications.markAsRead'(id) {
    const notification = Notifications.findOne(id);
    if (notification.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Notifications.update(id, { $set: { isRead: true } });
    NotificationUnreadCounters.update({owner: this.userId}, { $inc: { count: -1 } });
  },
});
