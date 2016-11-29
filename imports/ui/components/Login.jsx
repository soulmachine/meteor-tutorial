import React from 'react';
import { Meteor } from 'meteor/meteor';

import 'antd/dist/antd.css';
import Alert from 'antd/lib/alert';
import Form from 'antd/lib/form';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import Checkbox from 'antd/lib/checkbox';
import message from 'antd/lib/message';

import RecaptchaItem from './RecaptchaItem';

const FormItem = Form.Item;

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginFailed: false,
      loginFailedCount: parseInt(localStorage.getItem("login-failed-count")) || 0,
      failedReason: '',
    };
  }
  handleSubmit(e) {
    e.preventDefault();
    this.setState({loginFailed: false, failedReason: null});
    console.log("loginFailedCount", this.state.loginFailedCount);
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        if (this.state.loginFailedCount > 5) {
          Meteor.call('verifyCaptcha', values.captcha, (error, result) => {
            if (error) {
              console.log("Captcha verification failed with error: ", error);
              this.setState({ loginFailed: true, failedReason: '验证码错误' });
            } else {
              if (result) {
                Meteor.loginWithPassword(values.username, values.password, (error) => {
                  if (error) {
                    localStorage.setItem("login-failed-count", (this.state.loginFailedCount+1).toString());
                    this.setState({
                      loginFailed: true, loginFailedCount: (this.state.loginFailedCount + 1),
                      failedReason: '用户名或密码错误'
                    });
                  } else {
                    message.success("登录成功！", 3);
                    localStorage.removeItem("login-failed-count");
                    const previous = Session.get('previous-url');
                    if (previous) FlowRouter.redirect(Session.get('previous-url'));
                    else FlowRouter.redirect('/');
                    Session.set('previous-url', undefined);
                  }
                });
              } else {
                console.log("Captcha verification failed");
                this.setState({ loginFailed: true, failedReason: '验证码错误' });
              }
            }
          });
        } else {
          Meteor.loginWithPassword(values.username, values.password, (error) => {
            if (error) {
              localStorage.setItem("login-failed-count", (this.state.loginFailedCount+1).toString());
              this.setState({
                loginFailed: true, loginFailedCount: (this.state.loginFailedCount + 1),
                failedReason: '用户名或密码错误'
              });
            } else {
              message.success("登录成功！", 3);
              localStorage.removeItem("login-failed-count");
              const previous = Session.get('previous-url');
              if (previous) FlowRouter.redirect(Session.get('previous-url'));
              else FlowRouter.redirect('/');
              Session.set('previous-url', undefined);
            }
          });
        }
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const styles = {
      loginForm: {
        maxWidth: 300
      },
      loginFormForgot: {
        float: 'right'
      },
      loginFormButton: {
        width: '100%'
      }
    }
    return (
      <Form onSubmit={this.handleSubmit.bind(this)} style={styles.loginForm}>
        <FormItem>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入用户名或E-mail' }],
          })(
            <Input addonBefore={<Icon type="user" />} placeholder="用户名或E-mail" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码！' }],
          })(
            <Input addonBefore={<Icon type="lock" />} type="password" placeholder="密码" />
          )}
        </FormItem>
        { this.state.loginFailedCount > 5 ?
          <FormItem>
            {getFieldDecorator('captcha', {
              rules: [{required: true, message: 'Please input the captcha you got!'}],
            })(<RecaptchaItem />)}
          </FormItem>
          :
          null
        }
        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>记住我</Checkbox>
          )}
          <a className="login-form-forgot" href='/forgot-password' style={styles.loginFormForgot}>忘记密码</a>
          <Button type="primary" htmlType="submit" style={styles.loginFormButton}>
            登录
          </Button>
          或者 <a href="/signup">现在注册！</a>
        </FormItem>
        { this.state.loginFailed ?
          <Alert message={this.state.failedReason} type="error"/>
          : null
        }
      </Form>
    );
  }
};

export default Form.create()(Login);
