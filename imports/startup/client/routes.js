import React from 'react';
import {mount} from 'react-mounter';

import MainLayout from '../../ui/layouts/MainLayout';
import NotFound from '../../ui/components/NotFound';

import Welcome from '../../ui/components/Welcome';
import Todo from '../../ui/components/Todo';
import LoginPage from '../../ui/pages/LoginPage';
import SignupPage from '../../ui/pages/SignupPage';
import ForgotPassword from '../../ui/components/ForgotPassword';
import ResetPassword from '../../ui/components/ResetPassword';
import UserSettings from '../../ui/components/UserSettings';


const loggedInRoutes = FlowRouter.group({
  triggersEnter: [function() {
    if(!Meteor.loggingIn() && !Meteor.userId()) {
      if (FlowRouter.current().path != '/login' && FlowRouter.current().path != '/signup') { // all public pages
        Session.set("previous-url", FlowRouter.current().path);
        FlowRouter.redirect('/login');
      }
    }
  }]
});

FlowRouter.route("/", {
  action() {
    mount(MainLayout, {
      children: (<Welcome />)
    });
  },
  name: 'home'
});

loggedInRoutes.route("/todo", {
  action() {
    mount(MainLayout, {
      children: (<Todo />)
    });
  },
  name: 'todo'
});

loggedInRoutes.route("/settings", {
  action() {
    mount(MainLayout, {
      children: (<UserSettings />)
    });
  },
  name: 'settings'
});

loggedInRoutes.route("/settings/:activeTab", {
  action(params, queryParams) {
    mount(MainLayout, {
      children: (<UserSettings activeTab={params.activeTab}/>)
    });
  },
  name: 'settings'
});

FlowRouter.notFound = {
  action () {
    mount(MainLayout, {
      children: (<NotFound />)
    });
  }
};
FlowRouter.route('/logout', {
  action() {
    console.log("logout");
    Meteor.logout();
    FlowRouter.redirect('/');
  }
});

FlowRouter.route('/login', {
  name: 'login',
  action() {
    mount(MainLayout, {
      children: (<LoginPage />)
    });
  },
});

FlowRouter.route('/signup', {
  action() {
    mount(MainLayout, {
      children: (<SignupPage />)
    });
  },
});

FlowRouter.route('/forgot-password', {
  name: 'forgot-password',
  action() {
    mount(MainLayout, {
      children: (<ForgotPassword />)
    });
  },
});

FlowRouter.route('/reset-password/:token', {
  name: 'reset-password',
  action(params, queryParams) {
    mount(MainLayout, {
      children: (<ResetPassword token={params.token}/>)
    });
  },
});
