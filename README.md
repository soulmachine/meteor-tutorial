# meteor-tutorial

Meteor 入门教程。

Table of Contents
-----------------
1. [Step1: 新建一个工程](#step1-新建一个工程)
1. [Step2: 添加React支持](#step2-添加react支持)
1. [Step3: simple-todos-react](#step3-simple-todos-react)
1. [Step4: Flow Router](#step4-flow-router)

# Step1: 新建一个工程

现在 github 网页上新建一个 private 项目 `meteor-tutorial`，然后 clone 到本地

    git@github.com:soulmachine/meteor-tutorial.git
    mv meteor-tutorial tmp-meteor-tutorial

    meteor create meteor-tutorial
    mv tmp-meteor-tutorial/* meteor-tutorial/
    mv tmp-meteor-tutorial/.git/ meteor-tutorial/
    mv tmp-meteor-tutorial/.gitignore meteor-tutorial/
    rm -rf tmp-meteor-tutorial
    cd meteor-tutorial
    meteor npm install
    meteor

    git config user.name soulmachine
    git config user.email soulmachine@gmail.com
    git config github.user soulmachine
    git add *
    git add .meteor/
    git commit -m "Step1: 新建一个工程"
    git push origin master


# Step2: 添加React支持

添加 React 支持，

    meteor npm install --save react react-dom
    meteor npm install --save react-addons-pure-render-mixin
    meteor add react-meteor-data

添加 Ant Design UI 库，

    meteor npm install --save antd

安装一些必备的包，

    meteor npm install --save classnames

`git status` 总共有4个文件发生了变化，

    modified:   .meteor/packages
    modified:   .meteor/versions
    modified:   README.md
    modified:   package.json

配置 WebStorm 开发环境，

1. 点击菜单 `File->Open`，浏览到项目根目录，打开
1. 在左上角点击菜单 `Preferences->Language & Frameworks->JavaScript`，在右边的窗口中，`JavaScript language version` 选择`React JSX`，勾选`Perfer strict mode`
1. 浏览到 `Language & Frameworks->JavaScript->Libraries`，在右边的窗口中，勾选`ECMAScript 6`
1. 浏览到 `Language & Frameworks->JavaScript->Code Quality Tools->ESLint`，在右边的窗口中勾选`Enable`
1. 浏览到 `Language & Frameworks->Node.jsJ and NPM`，在右边的窗口中找到 `Node.js Core library`，点击 `Enable`按钮


# Step3: simple-todos-react

按照官方的 tutorial, <https://www.meteor.com/tutorials> , 完成 React 版的 simple-todos. 官方的文档写的非常好，每一步的 `git diff` 都有。

用 jsx 写 组件的时候，即使代码中没用使用 React, 也需要在文件开头 `import React from 'react';`。


# Step4: Flow Router

客户端路由是很重要的部件，本节我们引入路由。在 Meteor 领域， Flow Router 是历史最悠久也最成熟的，虽然跟React配合大家一般用 React Router，但是本节我们选择 Flow Router, 一是它的文档比较丰富，二是功能够用了。

先安装 Flow Router,

    meteor add kadira:flow-router

新建一个文件，`imports/startup/client/routes.js`,

```jsx
FlowRouter.route('/lists/:_id', {
  name: 'Lists.show',
  action(params, queryParams) {
    console.log("Looking at a list?", params);
  }
});
```

同时要在 `client/main.jsx` 中添加一行 `import '../imports/startup/client/routes.js';`，然后输入命令`meteor` 启动网站，在浏览器中输入 <http://localhost:3000/lists/123456>，在 Chrome 浏览器的 Developer Tool 的 Console中可以看到打印出了消息。这一小步证明 Flow Router 能正常工作。


客户端路由可以根据根据不同的URL，选择渲染不同的组件，这时候需要一个 Layout Manager来配合路由一起工作。 [blaze-layout](https://github.com/kadirahq/blaze-layout), [react-layout](https://github.com/kadirahq/meteor-react-layout)和[react-mounter](https://github.com/kadirahq/react-mounter) 是三个比较有名的 Layout Manager, blaze-layout 只能和Blazy一起使用，react-layout和 react-mounter能和React一起使用，react-layout只能和 Meteor 1.3 以下兼容， react-mounter 只能和 Meteor 1.3+兼容 ，因此我们只有一个选择，就是 react-mounter。

安装 react-mounter,

    npm install --save react-mounter

创建四个跟布局相关的组件，

`imports/ui/layouts/MainLayout.jsx`,

```jsx
import React from 'react';

import Header from './Header';
import Footer from './Footer';


function MainLayout(props) {
	return (
      <div>
        <header>
          <Header />
        </header>
        <main>
          {props.content}
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
    );
}

export default MainLayout;
```

`imports/ui/layouts/Header.jsx`,

```jsx
import React from 'react';

function Header() {
  return (
    <div>
      <a href="/">Home</a> { " " } <a href="/todo">Todo</a>
    </div>
  );
}

export default Header;
```

`imports/ui/layouts/Footer.jsx`,

```jsx
import React from 'react';

function Footer() {
    return (
    <p>
      Powered by Meteor
    </p>
  );
}

export default Footer;
```

`imports/ui/layouts/NotFound.jsx`,

```jsx
import React from 'react';

function NotFound() {
    return (
    <div >
      <h1>Oops! Nothing here.</h1>
      <a href="/">Go home</a>
    </div>
  );
}

export default NotFound;
```

将 `imports/ui/App.jsx` 重命名为 `Todo.jsx` 并移动到 `imports/ui/components`, 打开该文件，将 `App` 组件重命名为`Todo`。将 `imports/ui/AccountsUIWrapper.jsx` 和 `imports/ui/Task.jsx` 移动到 `imports/ui/components`.

    cd imports/ui/
    mkdir components
    git mv  App.jsx components/Todo.jsx
    git mv AccountsUIWrapper.jsx components/
    git mv Task.jsx components/

最后配置路由规则， `import/startup/client/routes.js`,

```jsx
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
```

最后，修改 `client/main.jsx` 的内容如下：

```jsx
import '../imports/startup/accounts-config.js';
import '../imports/startup/client/routes.js';
```

将 `client/main.html` 中的DOM根节点ID 改为 `react-root`, 因为 `react-mounter`默认会将渲染出来的组件挂载到 ID 为 `react-root` 的DOM根节点下。

