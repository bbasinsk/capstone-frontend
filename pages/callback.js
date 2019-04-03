import React from 'react';
import Router, { withRouter } from 'next/router';

import { setToken } from '../libraries/auth';
import { parseHash } from '../libraries/auth0';

class AuthCallback extends React.Component {
  componentDidMount() {
    parseHash((err, result) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.error('Something happened with the Sign In request');
        return;
      }

      setToken(result.idToken, result.accessToken);
      Router.push('/');
    });
  }

  render() {
    return null;
  }
}

export default withRouter(AuthCallback);
