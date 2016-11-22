import React from 'react';

import 'antd/dist/antd.css';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';

import Login from '../components/Login';

function LoginPage() {
  return (
    <Row>
      <Col span={8} offset={8}>
        <Login />
      </Col>
    </Row>
  )
}

export default LoginPage;
