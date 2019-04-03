import React from 'react';
import { login, logout } from '../../libraries/auth';

export default function LoginButton() {
  return (
    <div>
      <button type="button" onClick={() => login()}>
        Login
      </button>
      <button type="button" onClick={() => logout()}>
        Logout
      </button>
    </div>
  );
}
