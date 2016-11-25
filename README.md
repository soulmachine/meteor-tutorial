# meteor-tutorial

Meteor 入门教程。如何运行？

    meteor npm install
    meteor --settings settings.json


Table of Contents
-----------------
1. [Step1: 新建一个工程](#step1-新建一个工程)
1. [Step2: 添加React支持](#step2-添加react支持)
1. [Step3: simple-todos-react](#step3-simple-todos-react)
1. [Step4: Flow Router](#step4-flow-router)
1. [Step5: 设计布局](#step5-设计布局)
1. [Step6: 注册和登录](#step6-注册和登录)


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

    meteor npm install --save classnames indexof

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

同时要在 `client/main.js` 中添加一行 `import '../imports/startup/client/routes.js';`，然后输入命令`meteor` 启动网站，在浏览器中输入 <http://localhost:3000/lists/123456>，在 Chrome 浏览器的 Developer Tool 的 Console中可以看到打印出了消息。这一小步证明 Flow Router 能正常工作。


客户端路由可以根据根据不同的URL，选择渲染不同的组件，这时候需要一个 Layout Manager来配合路由一起工作。 [blaze-layout](https://github.com/kadirahq/blaze-layout), [react-layout](https://github.com/kadirahq/meteor-react-layout)和[react-mounter](https://github.com/kadirahq/react-mounter) 是三个比较有名的 Layout Manager, blaze-layout 只能和Blazy一起使用，react-layout和 react-mounter能和React一起使用，react-layout只能和 Meteor 1.3 以下兼容， react-mounter 只能和 Meteor 1.3+兼容 ，因此我们只有一个选择，就是 react-mounter。

安装 react-mounter,

    npm install --save react-mounter

创建三个跟布局相关的组件，

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
          {props.children}
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

创建一个 404 找不到时候的页面，`imports/ui/components/NotFound.jsx`, 内容跟 <https://github.com/ant-design/ant-design/blob/master/site/theme/template/NotFound.jsx> 一模一样，

```jsx
import React from 'react';

export default function NotFound() {
  return (
    <div id="page-404">
      <section>
        <h1>404</h1>
        <p>你要找的页面不存在 <a href="/">返回首页</a></p>
      </section>
      <style
        dangerouslySetInnerHTML={{
          __html: '#react-content { height: 100%; background-color: #fff }',
        }}
      />
    </div>
  );
}
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
```

最后，修改 `client/main.js` 的内容如下：

```jsx
import '../imports/startup/accounts-config.js';
import '../imports/startup/client/routes.js';
```

将 `client/main.html` 中的DOM根节点ID 改为 `react-root`, 因为 `react-mounter`默认会将渲染出来的组件挂载到 ID 为 `react-root` 的DOM根节点下。


# Step5: 设计布局

当前的页面太丑了，这一节我们设计布局，做一点美化工作。

将 <https://github.com/ant-design/ant-design/tree/master/site/theme/template/Layout> 下面的三个文件拷贝到 `imports/ui/layout`，进行一些修改，代码这里就不贴了。这一步工作量比较大。

关于样式，将 <https://github.com/ant-design/ant-design/tree/master/site/theme/static> 拷贝到 `imports/ui/static`，可以酌情删除一些不必要的样式文件，，删除 `client/main.css`，并在 `imports/ui/layout/index.jsx` 中引入所有 css 样式，

    import '../../ui/static/style';

由于这些文件是 LESS 文件，我们需要添加 LESS 支持，

    meteor add less

在 `Header.jsx` 怎么知道该高亮顶部导航栏中的哪个菜单呢？一般的做法是获取当前URL，从URL抽取出对应的`Menu.Item`的key, 知道了是哪个key, 就可以高亮显示那个菜单了。不过这里我偷了个懒，在配置路由时，设置 `name` 跟 `Header.jsx` 中的`Menu.Item` 的 key 相同，这样把`FlowRouter.getRouteName()`当做要高亮的`Menu.Item` 的 key，在 `MainLayout.jsx`把通过props传递给 `Header.jsx`，从而控制高亮显示某个菜单。


# Step6: 注册和登录

## 验证码

`accounts-ui`自带简单的界面，虽然在快速开发原型时很有用，但是最终你还是需要自己定制登录和注册界面，下面我们开始一步一步制作登录和注册界面。

在注册和登录的时候，都需要一个验证码，我们选择 Google reCAPTCHA, GitHub这里有一个现成的React 组件，[react-recaptcha](https://github.com/appleboy/react-recaptcha)。

首先按安装这个包，

    npm install --save react-recaptcha

使用这个包，需要在 `<head>` 头部引入 Google 的这个 JS 文件 <https://www.google.com/recaptcha/api.js>，为了能方便的在头部插入 `<script>`，我们使用这个小工具, [react-helmet](https://github.com/nfl/react-helmet),

    npm install --save react-helmet

然后，我们创建一个验证码组件， `imports/ui/components/RecaptchaItem.jsx`,

```jsx
import React from 'react';
import Helmet from "react-helmet";
import ReactRecaptcha from 'react-recaptcha';
import { Meteor } from 'meteor/meteor';

const RecaptchaItem = React.createClass({
  verifyCallback(result) {
    console.log('verifyCallback', result);
    this.props.onChange(result); // 认证通过时，通知到 form
  },
  render() {
    return (
      <div>
        <Helmet
          script={[
            {
              "src": "https://www.google.com/recaptcha/api.js?hl=zh_CN",
              "type": "text/javascript",
              "async": true,
              "defer": true
            },
          ]}
        />
        <ReactRecaptcha
          render="explicit"
          sitekey={Meteor.settings.public.siteKey}
          onloadCallback={() => {}}
          verifyCallback={this.verifyCallback}
        />
      </div>
    );
  }
});

export default RecaptchaItem;
```

要使用验证码，客户端需要知道公钥 sitekey, 服务端需要知道 secretkey, 在 Meteor 程序里我们一般把配置信息存放在根目录下的 `settings.json` 中，然后运行 `meteor --setings settings.json` 来启动这个 Web App. 然后在代码中可以访问这些配置，例如上上面的代码中使用了 `sitekey={Meteor.settings.public.siteKey}` 来获取公钥。注意不要把千万 `settings.json` 文件 commit 到git仓库。

验证码组件写完了，但是还没有结束，需要在服务端来校验验证码，创建一个文件 `imports/api/captcha.js`, 里面只有一个函数`verifyCaptcha()`，具体代码请阅读这个文件。只需要在 `server/main.js`中import 这个文件，因为客户端不需要调用这个函数。

`imports/api/captcha.js` 依赖下面两个包，

    meteor add http ejson

创建登录组件，代码见 `imports/ui/components/Login.jsx`，它是一个表单Form, 里面包含了一些字段。注意，`Meteor.loginWithPassword()`只能在客户端调用，不能用在服务端代码中。

创建注册组件，代码见 `imports/ui/components/Signup.jsx`，它也是一个表单Form。

以上两个组件的代码都借鉴了官方的例子 <https://ant.design/components/form/> ，可以两边对照看，方便理解代码。


## 登录和注册

接下来我们需要在 Header 的导航栏的中添加两个链接，登录和注册，分别指向`/login`和 `/signup`。当用户成功登录后，需要隐藏登录和注册链接，替换成一个下拉菜单，里面有`我的主页`、`设置`和`退出`等菜单。

首先新建两个组件，`imports/ui/components/Login.jsx` 和 `imports/ui/components/Signup.jsx`。然后，创建两个页面作为入口点提供给 Flow Router ，这两个页面逻辑很简单，仅仅只是居中显示 `Login`和`Signup`组件，代码见 `imports/ui/pages/LoginPage.jsx` 和 `imports/ui/pages/SignupPage.jsx`。

在 `imports/startup/client/routes.jsx` 中添加两条路由规则，

```javascript
FlowRouter.route('/login', {
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
```

有一点需要注意，默认的下拉菜单里的每一项，高度太高了，需要单独给一个样式，在 `Header.less`添加如下一段样式：

```css
#nav li ul li {
  height: 40px;
  line-height: 40px;
  min-width: 72px;
  text-align: center;
  border-bottom-width: 3px;

  &.ant-menu-item-selected a {
    color: #2db7f5;
    font-weight: bold;
  }
}
```

关于`退出`按钮，只需要在 `imports/startup/client/routes.js` 添加一个路由规则，即可实现功能，

```jsx
FlowRouter.route('/logout', {
  name: 'logout',
  action() {
    console.log("logout");
    Meteor.logout();
    FlowRouter.redirect('/');
  }
});
```

最后，当新的登录和注册逻辑能走通后，删除 `Todo.jsx` 里的登录按钮，

* 运行 `meteor remove accounts-ui`，卸载 `accounts-ui`，因为我们有了自己的登录和注册界面，不再需要这个包了。注意不要卸载 `accounts-password`，这个包负责底层逻辑，是一个login service, 我们依然需要它。
* 删除 `Todo.jsx` 里的 `AccountsUIWrapper`
* `git rm imports/ui/components/AccountsUIWrapper.jsx`
* `git rm imports/startup/accounts-config.js`，并删除 `client/main.js`里的一行 `import '../imports/startup/accounts-config.js';`

当前还有一个小问题，当用户“登录”或“注册”成功后，不会自动跳转到登录和注册前的URL，怎么办呢？可以把当前URL保存到Session里，等登录成功后再跳转回来。

首先安装 Session，

    meteor add session

在 `Header.jsx` 记录当前 URL，

```javascript
if (FlowRouter.current().path != '/login' && FlowRouter.current().path != '/signup') {
  Session.set("previous-url", FlowRouter.current().path);
}
```

登录或注册成功后，返回之前的页面，

```javascript
const previous = Session.get('previous-url');
if (previous) FlowRouter.redirect(Session.get('previous-url'));
else FlowRouter.redirect('/');
Session.set('previous-url', undefined);
```

（可选）为了调试方便，我们可以安装这个包，<https://github.com/msavin/Mongol>, 这个包可以查看客户端数据库 minimongo 里的所有 Collection。

    meteor add msavin:mongol

用浏览器打开 <http://localhost:3000/> 后按组合键 `Ctrl+M`，可以在网页右下键看到一个面板，在这里可以查看数据库里的所有数据，非常方便。由于 Mongol 是一个`debugOnly`的包， 当你编译 release 版的时候Meteor 的编译工具会自动的排除它，相当贴心。

这个工具只能查看客户端的minimongo里的数据，如果你的数据没有publish 到客户端，那它也是看不到的。为了完整的查看服务端Mongodb里的数据，可以用任何一个 MongoDB 客户端连接MongdoDB，比如官方的 [MongoDB Compass](https://www.mongodb.com/products/compass)。Meteor 的 MongoDB通常运行在 3001端口，可以输入 `meteor mongo`打开一个shell 查看端口。


## 忘记密码

忘记密码的功能需要给用户发送密码重置邮件，所以首先需要安装 `email`包，

    meteor add email

首先新建一个`ForgotPassword`组件，`imports/ui/components/ForgotPassword.jsx`, 在客户端调用 `Accounts.forgotPassword()`来发送密码重置邮件，详细代码见 `ForgotPassword.jsx`.

需要在`imports/startup/client/routes.js` 里为 `ForgotPassword`组件添加一条路由规则，

```javascript
FlowRouter.route('/forgot-password', {
  name: 'forgot-password',
  action() {
    mount(MainLayout, {
      children: (<ForgotPassword />)
    });
  },
});
```

邮件里默认的 `reset-password` 的URL是 `/#/reset-password/token`，例如 <http://localhost:3000/#/reset-password/75FUsHf3CiyGaGxr4akWWGetohIBb00AJ1gL0coQ58D>，如何需改URL的格式呢？ 需要定制邮件模板。

新建一个文件， `imports/startup/server/email-config.js`, 定制邮件模板，并在 `server/main.js`中import这个文件。

```javascript
// Reset password E-mail
Accounts.emailTemplates.resetPassword.from = function() {
  return "AwesomeSite Admin <no-replay@example.com>";
}
Accounts.emailTemplates.resetPassword.subject = function (user) {
  return "How to reset your password on " + Meteor.absoluteUrl();
};
Accounts.emailTemplates.resetPassword.text = function (user, url) {
  url = url.replace('#/', '');
  return "Hello " + user.username + ",\n\nTo reset your password, simply click the link below.\n\n" + url + "\n\nThanks.";
};
```

此时，我们用用浏览器打开 `http://localhost:3000/forgot-password`，点击提交按钮，在服务器端的命令行下，会发现打印出了邮件的内容，但是并没有发送成功，

    ====== BEGIN MAIL #0 ======
    (Mail not sent; to enable sending, set the MAIL_URL environment variable.)

原来，我们还需要设置一个`MAIL_URL`，指定一个邮件发送商，以 Mailgun 为例，它的`MAIL_URL`的格式如下：

    export MAIL_URL="smtp://postmaster%40<your-mailgun-address>.mailgun.org:<password>@smtp.mailgun.org:587";

`%40` 其实就是 `@`字符。

举个例子，我用Mailgun提供的免费sandbox做测试，真实的`MAIL_URL`是，

    export MAIL_URL="smtp://postmaster%40sandbox2cccd60b3708468faf6c2bfdda8d8ee3.mailgun.org:997b6b3a8e05f882f25b6ed1c3c817f4@smtp.mailgun.org:587" meteor  --settings settings.json

当用户在点击邮件里的链接 <http://localhost:3000/#/reset-password/75FUsHf3CiyGaGxr4akWWGetohIBb00AJ1gL0coQ58D>，我们需要响应该 URL，首先，添加一条路由规则，

```javascript
FlowRouter.route('/reset-password/:token', {
  name: 'reset-password',
  action(params, queryParams) {
    mount(MainLayout, {
      children: (<ResetPassword token={params.token}/>)
    });
  },
});
```

然后新建一个`ResetPassword` 组件，`imports/ui/components/ResetPassword.jsx`, 核心逻辑就是两个输入框，用于输入两遍密码，以及调用``来重置密码，代码见该文件。


## 添加额外字段

默认的 `accounts-password`，用户的信息只有 `username`, `email`, `password`三项，如何添加额外的字段呢？假设我们要添加两个字段，性别 `gender` 和出生年份 `birthyear`。

根据官网的文档 [custom-user-data](https://guide.meteor.com/accounts.html#custom-user-data)，添加额外字段，最好是添加 top-level 的字段，不要用 `profile`这个字段。

基本的思路是：

1. 在客户端调用`Accounts.createUser()`的时候，传入第四个参数`profile`, `profile`就是一个普通的对象，包含两个字段 `gender`和`birthyear`
1. 在服务端自定义一个 `Accounts.onCreateUser()`函数，Meteor会自动调用这个函数，在这个函数内部，将客户端传过来的`profile`保存起来

第一步，修改 `Signup.jsx`，添加两个字段，性别`gender`和出生年份`birthday`，在 `handleSubmit()`中调用 `Accounts.createUser()`时，第四个参数设置为 `profile: {gender: values.gender, birthyear: parseInt(values.birthyear)}`，更多细节请阅读该文件。

第二步，新建一个文件 `imports/startup/server/extra-fields.js`并在 `server/main.js` 引入这个文件，该文件内容如下，

```javascript
Accounts.onCreateUser(function(options, user) {
  return _.extend(user, {gender: options.profile.gender, birthyear: options.profile.birthyear});
});
```
注意，为了防止客户端添加任意字段，`onCreateUser()`千万不要写成下面这样：

```javascript
Accounts.onCreateUser(function(options, user) {
  return _.extend(user, {...options});
});
```

前面那个`onCreateUser()`是正确的写法，即使客户端在 `profile` 里塞入任意字段，服务端还是只保存`gender`和 `birthyear`，把其他字段丢弃掉。

为了防止客户端直接修改用户资料，可以在 `client/main.js` 中添加如下代码：

```javascript
// Deny all client-side updates to user documents
Meteor.users.deny({
  update() { return true; }
});
```

在浏览器里注册一个新用户，然后用 MongoDB Compass 连接上数据库，可以看到新用户多了两个字段 `gender`和 `birthyear`，而老的用户是没有 `profile`这个字段的，大功告成！


## 保护私密页面

网站上的某些页面，必须要用户登录后才能访问，Flow Router 可以很方便的做到这一点。举个例子，假设 `/todo`这个页面需要保护起来。

现在 `imports/startup/client/routes.js` 里新建一个 group,

```javascript
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
```

以后所有需要保护起来的私密页面，都可以用这个 group，

```javascript
loggedInRoutes.route("/todo", {
  action() {
    mount(MainLayout, {
      children: (<Todo />)
    });
  },
  name: 'todo'
});
```


# 参考资料：

* [Creating a Custom Login and Registration Form with Meteor - sitepoint](https://www.sitepoint.com/creating-custom-login-registration-form-with-meteor/)
* [Building a customized accounts ui for Meteor - by Ben McMahen](http://blog.benmcmahen.com/post/41741539120/building-a-customized-accounts-ui-for-meteor)
* [meteor-useraccounts/boilerplates/bootstrap-flow-router-react/](https://github.com/meteor-useraccounts/boilerplates/tree/master/bootstrap-flow-router-react)
* [meteor/todos](https://github.com/meteor/todos)
* [meteor-boilerplate](https://github.com/surfer77/meteor-boilerplate)
* [Meteor-reCAPTCHA](https://github.com/Altapp/Meteor-reCAPTCHA)
* [Extending Meteor.users - Medium](https://medium.com/all-about-meteorjs/extending-meteor-users-300a6cb8e17f)
* [Guide: how to use Flow Router for authentication and permissions in the route layer](https://crater.io/posts/CsR7ChkDiHEWfhkHn/guide-how-to-use-flow-router-for-authentication-and)
* [Meteor: Using Flow Router for authentication and permissions](https://medium.com/@satyavh/using-flow-router-for-authentication-ba7bb2644f42#.xw8wfl3yg)

