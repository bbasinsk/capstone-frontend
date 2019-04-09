import React from 'react';
import { Button } from 'antd';
import { login, logout } from '../../libraries/auth';

export default function LoginButton() {
  return (
    <div>
      <Button type="primary" onClick={() => login()}>
        Login
      </Button>
      <Button onClick={() => logout()}>Logout</Button>
    </div>
  );
}
