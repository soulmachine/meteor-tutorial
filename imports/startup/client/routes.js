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
import VerifyEmail from '../../ui/components/VerifyEmail';
import Notifications from '../../ui/components/Notifications';


const loggedInRoutes = FlowRouter.group({
  triggersEnter: [function () {
    if (!Meteor.loggingIn() && !Meteor.userId()) {
      Session.set("previous-url", FlowRouter.current().path);
      FlowRouter.go('/login');
    }
  }]
});

loggedInRoutes.route("/", {
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

loggedInRoutes.route("/notifications/:page?", {
  action(params, queryParams) {
    mount(MainLayout, {
      children: (<Notifications page={params.page} />)
    });
  },
  name: 'notifications'
});

loggedInRoutes.route("/settings/:activeTab?", {
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

FlowRouter.route('/verify-email/:token', {
  name: 'verify-email',
  action(params, queryParams) {
    console.log('route verify-email');
    mount(MainLayout, {
      children: (<VerifyEmail token={params.token} />)
    });
  },
});
