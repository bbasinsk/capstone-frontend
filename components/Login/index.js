import React from 'react';
import { login } from '../../libraries/auth0';

export default function LoginButton() {
  const onClick = () => login();
  return (
    <div>
      <button type="button" onClick={onClick}>
        Login
      </button>
    </div>
  );
}
