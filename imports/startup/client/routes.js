import React from 'react';
import {mount} from 'react-mounter';

import MainLayout from '../../ui/layouts/MainLayout';
import NotFound from '../../ui/layouts/NotFound';

import Welcome from '../../ui/components/Welcome';
import Todo from '../../ui/components/Todo';


FlowRouter.route("/", {
  action() {
    mount(MainLayout, {
      content: (<Welcome name="soulmachine"/>)
    });
  }
});

FlowRouter.route("/todo", {
  action() {
    mount(MainLayout, {
        content: (<Todo />)
    });
  }
});

FlowRouter.notFound = {
  action () {
    mount(MainLayout, {
      content: (<NotFound />)
    });
  }
};
