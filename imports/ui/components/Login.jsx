import React from 'react';
import { Meteor } from 'meteor/meteor';

import 'antd/dist/antd.css';
import Form from 'antd/lib/form';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import Checkbox from 'antd/lib/checkbox';
import message from 'antd/lib/message';

import RecaptchaItem from './RecaptchaItem';

const FormItem = Form.Item;

class Login extends React.Component {
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        Meteor.call('verifyCaptcha', values.captcha, function(error, result){
          if(error){
            console.log("Captcha verification failed with error: ", error);
          } else {
            if (result) {
              Meteor.loginWithPassword(values.username, values.password, function(error){
                if (error) message.error("登录失败，用户名或密码错误");
                else message.success("登录成功！");
              });
            } else {
              console.log("Captcha verification failed");
            }
          }
        });
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
        <FormItem>
          {getFieldDecorator('captcha', {
            rules: [{ required: true, message: 'Please input the captcha you got!' }],
          })(<RecaptchaItem />)}
        </FormItem>
        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>记住我</Checkbox>
          )}
          <a className="login-form-forgot" style={styles.loginFormForgot}>忘记密码</a>
          <Button type="primary" htmlType="submit" style={styles.loginFormButton}>
            登录
          </Button>
          或者 <a>现在注册！</a>
        </FormItem>
      </Form>
    );
  }
};

export default Form.create()(Login);
