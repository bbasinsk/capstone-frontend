import React from 'react';
import { Button } from 'antd';
import { login, logout } from '../../libraries/auth';

const Login = () => (
  <div>
    <Button type="primary" onClick={() => login()}>
      Login
    </Button>
    <Button onClick={() => logout()}>Logout</Button>
  </div>
);

export default Login;
