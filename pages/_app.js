import React from 'react';
import App, { Container } from 'next/app';
import 'antd/dist/antd.less';
import initializeAnalytics from '../libraries/analytics';
import faIcons from '../components/_head/fa-icons';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  componentDidMount() {
    initializeAnalytics();
    faIcons();
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <Component {...pageProps} />
      </Container>
    );
  }
}

export default MyApp;
