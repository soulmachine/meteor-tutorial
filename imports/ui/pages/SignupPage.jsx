import React from 'react';

import 'antd/dist/antd.css';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';

import Signup from '../components/Signup';

function SignupPage() {
  return (
    <Row>
      <Col span={8} offset={8}>
        <Signup />
      </Col>
    </Row>
  )
}

export default SignupPage;


