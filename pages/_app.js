import React from 'react';
import App, { Container } from 'next/app';
import initializeAnalytics from '../libraries/analytics';
import faIcons from '../components/_head/fa-icons';
import sentry from '../shared/utils/sentry';
import 'antd/dist/antd.less';

const { Sentry, captureException } = sentry();

export default class MyApp extends App {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      errorEventId: undefined
    };
  }

  static async getInitialProps({ Component, ctx }) {
    try {
      let pageProps = {};

      if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
      }

      return { pageProps };
    } catch (error) {
      // Capture errors that happen during a page's getInitialProps.
      // This will work on both client and server sides.
      const errorEventId = captureException(error, ctx);
      return {
        hasError: true,
        errorEventId
      };
    }
  }

  static getDerivedStateFromProps(props, state) {
    // If there was an error generated within getInitialProps, and we haven't
    // yet seen an error, we add it to this.state here
    return {
      hasError: props.hasError || state.hasError || false,
      errorEventId: props.errorEventId || state.errorEventId || undefined
    };
  }

  static getDerivedStateFromError() {
    // React Error Boundary here allows us to set state flagging the error (and
    // later render a fallback UI).
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const errorEventId = captureException(error, { errorInfo });

    // Store the event id at this point as we don't have access to it within
    // `getDerivedStateFromError`.
    this.setState({ errorEventId });
  }

  componentDidMount() {
    initializeAnalytics();
    faIcons();
  }

  render() {
    const { Component, pageProps } = this.props;

    return this.state.hasError ? (
      <section>
        <h1>There was an error!</h1>
        <p>
          <a
            href="#"
            onClick={() =>
              Sentry.showReportDialog({ eventId: this.state.errorEventId })
            }
          >
            <span role="img" aria-label="mega horn">
              📣
            </span>{' '}
            Report this error
          </a>
        </p>
        <p>
          <a
            href="#"
            onClick={() => {
              window.location.reload(true);
            }}
          >
            Or, try reloading the page
          </a>
        </p>
      </section>
    ) : (
      // Render the normal Next.js page
      <Container>
        <Component {...pageProps} />
      </Container>
    );
  }
}
