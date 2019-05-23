import jwtDecode from 'jwt-decode';
import gql from 'graphql-tag';
import persist from './persist';
import { login as loginAuth0, logout as logoutAuth0 } from './auth0';
import apolloClient from './apollo/client';

export const createUser = (accessToken, name) => {
  const mutation = gql`
    mutation insertUser($name: String!) {
      insert_user(objects: [{ name: $name }]) {
        returning {
          email
        }
      }
    }
  `;

  const client = apolloClient({}, accessToken, {});
  client.mutate({ mutation, variables: { name }, errorPolicy: 'ignore' });
};

export const setToken = accessToken => {
  if (!process.browser) {
    return;
  }

  persist.willSetUser(jwtDecode(accessToken));
  persist.willSetAccessToken(accessToken);
};

export const unsetToken = () => {
  if (!process.browser) {
    return;
  }

  persist.willRemoveUser();
  persist.willRemoveAccessToken();

  // to support logging out from all windows
  window.localStorage.setItem('logout', Date.now());
};

export const getUserFromServerCookie = req => {
  if (!req.headers.cookie) {
    return undefined;
  }
  const jwtCookie = req.headers.cookie
    .split(';')
    .find(c => c.trim().startsWith('accessToken='));
  if (!jwtCookie) {
    return undefined;
  }
  const jwt = jwtCookie.split('=')[1];
  return jwtDecode(jwt);
};

export const getUserFromLocalCookie = () => persist.willGetUser();

export const login = () => {
  loginAuth0();
};
export const logout = () => {
  unsetToken();
  logoutAuth0();
};
