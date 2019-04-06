import React from 'react';
import Router, { withRouter } from 'next/router';

import { setToken, createUser } from '../libraries/auth';
import { parseHash, userInfo } from '../libraries/auth0';

class AuthCallback extends React.Component {
  componentDidMount() {
    parseHash((err, result) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.error('Something happened with the Sign In request');
        return;
      }

      // store the auth tokens in local storage
      setToken(result.idToken, result.accessToken);

      // get the user info and store in in the database
      userInfo(result.accessToken, (error, user) => {
        createUser(result.idToken, user.name);
      });

      Router.push('/');
    });
  }

  render() {
    return null;
  }
}

export default withRouter(AuthCallback);
