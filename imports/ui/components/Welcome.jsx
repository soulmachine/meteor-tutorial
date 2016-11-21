import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';

function Welcome({currentUser}) {
  return (
    <div>Hello, {currentUser ? currentUser.username : 'World'}</div>
  );
}

Welcome.propTypes = {
  currentUser: React.PropTypes.object,
};

export default createContainer(() => {
  Meteor.subscribe('tasks');
  return {
    currentUser: Meteor.user(),
  };
}, Welcome);
