import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { createContainer } from 'meteor/react-meteor-data';

import 'antd/dist/antd.css';
import Alert from 'antd/lib/alert';
import Button from 'antd/lib/button';
import Col from 'antd/lib/col';
import Form from 'antd/lib/form';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import Menu from 'antd/lib/menu';
import Row from 'antd/lib/row';
import Tooltip from 'antd/lib/tooltip';
import message from 'antd/lib/message';

const FormItem = Form.Item;


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
};
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const ProfileTab = Form.create()(React.createClass({
  getInitialState() {
    return {
      updateFailed: false,
      isFirst: true,
    };
  },
  componentWillReceiveProps(nextProps){
    if (this.state.isFirst && nextProps.currentUser && nextProps.currentUser.nickname) {
      nextProps.form.setFieldsValue({nickname: nextProps.currentUser.nickname});
      this.setState({isFirst: false});
    }
  },
  checkNickname(rule, value, callback) {
    console.log(value);
    if (value) {
      if (value !== this.props.currentUser.nickname) {
        callback();
      } else {
        callback('昵称没有变化');
      }
    } else {
      callback('昵称为空');
    }
  },
  handleSubmit(e) {
    e.preventDefault();
    this.setState({updateFailed: false});
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        Meteor.call('user.updateNickname', values.nickname, (error, result) => {
          if (error) {
            this.setState({updateFailed: true});
            console.log(error);
          } else {
            this.setState({updateFailed: false});
            message.success("更新成功！", 3);
          }
        });
      }
    });
  },
  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={this.handleSubmit} style={styles.loginForm}>
        <FormItem
          {...formItemLayout}
          label="用户名"
        >
          <Input disabled value={this.props.currentUser ? this.props.currentUser.username : null } />
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="个性域名"
        >
          <span>{ Meteor.absoluteUrl() + 'people/' + (this.props.currentUser ? this.props.currentUser.username : '') }</span>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="昵称"
        >
          {getFieldDecorator('nickname', {
            rules: [{
              validator: this.checkNickname,
            }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </FormItem>
        { this.state.updateFailed ?
          <Alert message="保存失败" type="error"/>
          : null
        }
      </Form>
    );
  },
}));

const ChangePasswordForm = Form.create()(React.createClass({
  getInitialState() {
    return {
      showChangePaswordForm: false,
      passwordDirty: false,
    };
  },
  handleSubmit(e) {
    e.preventDefault();
    this.setState({showChangePaswordForm: false});
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        Accounts.changePassword(values.old_password, values.password, (error) => {
          if (error) {
            message.error("旧密码不正确，密码更新失败", 3);
            console.error(error);
          } else {
            message.success("密码更新成功", 3);
          }
        });
      }
    });
  },
  handlePasswordBlur(e) {
    const value = e.target.value;
    this.setState({ passwordDirty: this.state.passwordDirty || !!value });
  },
  checkPassowrd(rule, value, callback) {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不一致！');
    } else {
      if (value && value == form.getFieldValue('old_password')) {
        callback('新密码与旧密码一样');
      } else {
        callback();
      }
    }
  },
  checkConfirm(rule, value, callback) {
    const form = this.props.form;
    if (value && this.state.passwordDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  },
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
    };

    if (this.state.showChangePaswordForm) {
      return (
        <Form horizontal onSubmit={this.handleSubmit} style={{maxWidth: 300}}>
          <FormItem
            {...formItemLayout}
            label="旧密码"
            hasFeedback
          >
            {getFieldDecorator('old_password', {
              rules: [{
                required: true, message: '请输入旧密码',
              }],
            })(
              <Input type="password" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="新密码"
            hasFeedback
          >
            {getFieldDecorator('password', {
              rules: [{
                required: true, message: '请输入密码',
              }, {
                validator: this.checkConfirm,
              }],
            })(
              <Input type="password" onBlur={this.handlePasswordBlur} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="确认新密码"
            hasFeedback
          >
            {getFieldDecorator('confirm', {
              rules: [{
                required: true, message: '请确认你的密码',
              }, {
                validator: this.checkPassowrd,
              }],
            })(
              <Input type="password" />
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit">确定</Button>
          </FormItem>
        </Form>
      );
    } else {
      return (
        <a href="javascript:;" onClick={() => this.setState({showChangePaswordForm: true})}>修改密码</a>
      );
    }
  }
}));

const TIME_OUT = 60;  // seconds

const AccountTab = React.createClass({
  getInitialState() {
    return {
      counter: TIME_OUT,
      intervalId: null,
      showChangePaswordForm: false,
    };
  },
  resendEmail() {
    Meteor.call('sendVerificationEmail', (error, result)=> {
      if (error) {
        message.error("验证邮件重发失败", 3);
        console.error(error);
      } else {
        message.success("验证邮件重发成功", 3);
      }
    });

    intervalId = Meteor.setInterval(() => {
      if (this.state.counter > 0) this.setState({counter: this.state.counter-1});
    }, 1000);
    this.setState({intervalId: intervalId});
  },
  componentWillUpdate() {
    if (this.state.counter <= 1) { // attention! it's 1 instead of 0
      Meteor.clearInterval(this.state.intervalId);
      this.setState({counter: TIME_OUT, intervalId: null});
    }
  },
  render() {
    return (
      <div>
        <Row>
          <Col span={1}>邮箱：</Col>
          <Col span={12}>
            { this.props.currentUser ? this.props.currentUser.emails[0].address + (this.props.currentUser.emails[0].verified ? "(已验证)" : null) : null}
            <br />
            { this.props.currentUser && !this.props.currentUser.emails[0].verified ?
              <span>
                <Alert message="你的邮箱尚未激活，请查收邮件激活。激活后你就可以使用发帖，点评等功能啦。" type="warning" />
                <Button type="primary" onClick={this.resendEmail} disabled={this.state.counter!=TIME_OUT}>{this.state.counter != TIME_OUT ? "再发一次("+this.state.counter+")" : "再发一次"}</Button>
              </span>
              : null
            }
          </Col>
        </Row>
        <Row>
          <Col span={1}>密码：</Col>
          <Col span={12}><ChangePasswordForm /></Col>
        </Row>
      </div>
    );
  },
});

class UserSettings extends React.Component {
  render() {
    const activeTab = this.props.activeTab || 'profile';

    return (
      <div>
        <div style={{height: '48px', borderBottom: "1px solid #e9e9e9", background: "#fff"}}>
          <div style={{padding: '0 50px'}}>
            <Menu mode="horizontal" selectedKeys={['settings/' + activeTab]} style={{marginLeft: 124}}>
              <Menu.Item key="settings/profile"><a href="/settings/profile">基本资料</a></Menu.Item>
            <Menu.Item key="settings/account"><a href="/settings/account">账号和密码</a></Menu.Item>
              <Menu.Item key="settings/notifications"><a href="/settings/notifications">消息和通知</a></Menu.Item>
            </Menu>
          </div>
        </div>
        <div style={{padding: "0 50px"}}>
          <div style={{margin: '24px 0 0', position: 'relative', overflow: "hidden"}}>
            { activeTab == 'profile' ? <ProfileTab currentUser={this.props.currentUser} /> : null  }
            { activeTab == 'account' ? <AccountTab currentUser={this.props.currentUser} /> : null  }
            { activeTab == 'profile' ? <div></div> : null }
            { activeTab == 'notifications' ? <div></div> : null }
          </div>
        </div>
      </div>
    );
  }
};


export default createContainer(() => {
  return {
    currentUser: Meteor.user(),
  };
}, UserSettings);
