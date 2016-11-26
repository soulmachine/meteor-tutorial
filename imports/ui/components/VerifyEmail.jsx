import React from 'react';
import { Accounts } from 'meteor/accounts-base';

import 'antd/dist/antd.css';
import Alert from 'antd/lib/alert';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';

export default class VerifyEmail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      verificationFailed: false,
    };
  }
  componentDidMount() {
    Accounts.verifyEmail(this.props.token, (error) => {
      if (error) {
        this.setState({verificationFailed: true});
        console.log(error);
      } else {
        this.setState({verificationFailed: false});
      }
    });
  }
  render() {
    return (
      <Row>
        <Col span={8} offset={8}>
          <div style={{ height: 210 }}>
            { this.state.verificationFailed ?
              <Alert
                message="邮箱验证失败"
                description='链接已经过期。请登录后点击右上角"设置->账号和密码"，重新发送邮件'
                type="error"
                showIcon
              />
              :
              <Alert message="邮箱验证成功" type="success" showIcon />
            }
          </div>
        </Col>
      </Row>
    );
  }
};
