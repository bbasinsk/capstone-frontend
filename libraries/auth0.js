import auth0 from 'auth0-js';

const getAuth0 = () =>
  new auth0.WebAuth({
    domain: 'benbasinski.auth0.com',
    clientID: 'XCKhjoq3Mp2QFBb5d6VX9YvzHtv89X90',
    redirectUri: 'http://localhost:3000/callback',
    responseType: 'token id_token',
    scope: 'openid'
  });

const getBaseUrl = () => `${window.location.protocol}//${window.location.host}`;

export const login = () =>
  getAuth0().authorize({
    // connection: 'google'
  });
export const logout = () => getAuth0().logout({ returnTo: getBaseUrl() });
export const parseHash = callback => getAuth0().parseHash(callback);
