// @flow
import * as React from 'react';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';
import PropTypes from 'prop-types';
import 'isomorphic-fetch';
import cookies from 'next-cookies';
import apolloClient from './apolloClient';
import persist from './persist';

type Props = {
  headers: HeadersType,
  accessToken?: string,
  router: Object,
  apolloState: Object
};

type Context = {
  pathname: string,
  query: Object,
  asPath: string,
  req?: {
    headers?: Object
  },
  res?: Object,
  jsonPageRes?: Object,
  err?: Object
};

export default (
  Component: React.ComponentType<*>
): React.ComponentType<Props> =>
  class extends React.Component<Props> {
    static propTypes = {
      apolloState: PropTypes.object.isRequired,
      headers: PropTypes.object.isRequired,
      accessToken: PropTypes.string
    };

    static defaultProps = {
      accessToken: ''
    };

    constructor(props: Props) {
      super(props);
      this.apolloClient = apolloClient(
        {},
        '',
        this.props.apolloState,
        props.router.url.query.meetingId
      );
    }

    static async getInitialProps(ctx: Context) {
      let apolloState = {};

      const headers = ctx.req ? ctx.req.headers : {};
      const token: string = cookies(ctx)[persist.ACCESS_TOKEN_KEY];

      const props = {
        router: {
          url: { query: ctx.query, pathname: ctx.pathname }
        },
        ...(await (typeof Component.getInitialProps === 'function'
          ? Component.getInitialProps(ctx)
          : {}))
      };

      if (!process.browser) {
        console.log('server query:', ctx.query.meetingId);
        const client = apolloClient(
          headers || {},
          token || '',
          {},
          ctx,
          ctx.query.meetingId
        );

        try {
          const app = (
            <ApolloProvider client={client}>
              <ApolloHooksProvider client={client}>
                <Component {...props} />
              </ApolloHooksProvider>
            </ApolloProvider>
          );
          await getDataFromTree(app);
        } catch (error) {
          // Prevent Apollo Client GraphQL errors from crashing SSR.
          // Handle them in components via the data.error prop:
          // https://github.com/apollographql/react-apollo/issues/406
          // http://dev.apollodata.com/react/api-queries.html#graphql-query-data-error
        }

        apolloState = client.cache.extract();
      }

      return {
        apolloState,
        headers,
        ...props
      };
    }

    apolloClient: Object;

    render() {
      return (
        <ApolloProvider client={this.apolloClient}>
          <ApolloHooksProvider client={this.apolloClient}>
            <Component {...this.props} />
          </ApolloHooksProvider>
        </ApolloProvider>
      );
    }
  };
