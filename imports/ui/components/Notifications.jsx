import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import 'antd/dist/antd.css';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Pagination from 'antd/lib/pagination';


class Notifications extends React.Component {
  onChange(page) {
    FlowRouter.go("/notifications/" + page);
  }
  clickMessage(id) {
    console.log(id);
    Meteor.call('notification.markAsRead', id, (error, result) => {
      if(error){
        console.log("notification.markAsRead failed with error: ", error);
      } else {
        console.log("notification.markAsRead succeeded");
      }
    });
  }
  render() {
    console.log(this.props.page);
    return (
      <div style={{padding: "0 50px"}}>
        <div style={{borderBottom: "1px solid #CCC", fontSize: 14, fontWeight: "bold", paddingBottom: 10}}>全部消息</div>
        {this.props.notifications.map((notification, i) => {
          const user = Meteor.users.findOne(notification.sender);
          return (
            <div key={"notification:" + i} style={{borderBottom: "1px dashed #CCC", padding: 8, fontWeight: notification.isRead ? "normal" : "bold"}} onClick={this.clickMessage.bind(this, notification._id)}>
              <a href={"/people/" + user.username}>{user.username}</a>{notification.action}<a href={notification.link}>{notification.title}</a>
            </div>
          );
        })}
        <Row style={{marginTop: 20}}>
          <Col span={8} offset={9}>
            <Pagination simple pageSize={Meteor.settings.public.recordsPerPage} current={this.props.page}
                        onChange={this.onChange.bind(this)} total={this.props.totalCount} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default createContainer(({ page }) => {
  const currentPage = parseInt(page) || 1;
  const skipCount = (currentPage - 1) * Meteor.settings.public.recordsPerPage;
  Meteor.subscribe('notifications', skipCount);
  Meteor.subscribe('notification-total-count');

  const { Notifications } = require('../../api/notifications.js');

  return {
    page: currentPage,
    notifications: Notifications.find().fetch(),
    totalCount: Counter.get("notification-total-count"),
  };
}, Notifications);
