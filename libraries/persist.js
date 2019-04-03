// @flow
import cookies from 'js-cookie';

export default class persist {
  // accessToken ================

  static get ACCESS_TOKEN_KEY(): string {
    return 'accessToken';
  }

  static async willGetAccessToken() {
    return cookies.get(persist.ACCESS_TOKEN_KEY);
  }

  static async willSetAccessToken(value: string) {
    return cookies.set(persist.ACCESS_TOKEN_KEY, value);
  }

  static async willRemoveAccessToken() {
    return cookies.remove(persist.ACCESS_TOKEN_KEY);
  }

  // user ================

  static get USER_KEY(): string {
    return 'user';
  }

  static willGetUser() {
    return cookies.getJSON(persist.USER_KEY);
  }

  static async willSetUser(value: any) {
    return cookies.set(persist.USER_KEY, value);
  }

  static async willRemoveUser() {
    return cookies.remove(persist.USER_KEY);
  }

  // idToken ================

  static get ID_TOKEN(): string {
    return 'idToken';
  }

  static async willGetIdToken() {
    return cookies.get(persist.ID_TOKEN);
  }

  static async willSetIdToken(value: any) {
    return cookies.set(persist.ID_TOKEN, value);
  }

  static async willRemoveIdToken() {
    return cookies.remove(persist.ID_TOKEN);
  }
}
