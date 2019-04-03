import React from 'react';
import Router from 'next/router';

import { getUserFromServerCookie, getUserFromLocalCookie } from './auth';

export default Component =>
  class DefaultPage extends React.Component {
    static getInitialProps(ctx) {
      const loggedUser = process.browser
        ? getUserFromLocalCookie()
        : getUserFromServerCookie(ctx.req);

      const pageProps =
        Component.getInitialProps && Component.getInitialProps(ctx);

      return {
        ...pageProps,
        ...(loggedUser && { loggedUser }),
        isAuthenticated: !!loggedUser
      };
    }

    constructor(props) {
      super(props);

      this.logout = this.logout.bind(this);
    }

    componentDidMount() {
      window.addEventListener('storage', this.logout, false);
    }

    componentWillUnmount() {
      window.removeEventListener('storage', this.logout, false);
    }

    logout(eve) {
      if (eve.key === 'logout') {
        Router.push(`/?logout=${eve.newValue}`);
      }
    }

    render() {
      return <Component {...this.props} />;
    }
  };
