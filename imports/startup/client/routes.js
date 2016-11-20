import React from 'react';
import {mount} from 'react-mounter';

import MainLayout from '../../ui/layouts/MainLayout';
import NotFound from '../../ui/components/NotFound';

import Welcome from '../../ui/components/Welcome';
import Todo from '../../ui/components/Todo';


FlowRouter.route("/", {
  action() {
    mount(MainLayout, {
      children: (<Welcome name="soulmachine"/>)
    });
  },
  name: 'home'
});

FlowRouter.route("/todo", {
  action() {
    mount(MainLayout, {
      children: (<Todo />)
    });
  },
  name: 'todo'
});

FlowRouter.notFound = {
  action () {
    mount(MainLayout, {
      children: (<NotFound />)
    });
  }
};
FlowRouter.route('/logout', {
  name: 'logout',
  action() {
    console.log("logout");
    Meteor.logout();
    FlowRouter.redirect('/');
  }
});