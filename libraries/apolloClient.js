import ws from 'ws';
import { split } from 'apollo-link';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-client-preset';
import { getMainDefinition } from 'apollo-utilities';
import persist from './persist';

let apolloClient = null;

const httpLink = createHttpLink({
  uri: 'https://meeting-magic-backend.herokuapp.com/v1alpha1/graphql',
  credentials: 'include'
});

const wsLink = new WebSocketLink({
  uri: 'wss://meeting-magic-backend.herokuapp.com/v1alpha1/graphql',
  options: {
    reconnect: true
  },
  webSocketImpl: process.browser ? undefined : ws
});

function createClient(headers, token, initialState) {
  let accessToken = token;

  (async () => {
    // eslint-disable-next-line no-param-reassign
    accessToken = token || (await persist.willGetAccessToken());
  })();

  const authLink = new ApolloLink((operation, forward) => {
    const adminHeaders = process.env.HASURA_ADMIN_SECRET && {
      'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET
    };

    operation.setContext({
      headers: {
        ...(accessToken && { authorization: `Bearer ${accessToken}` }),
        ...adminHeaders
      }
    });
    return forward(operation);
  }).concat(httpLink);

  const link = split(
    // split based on operation type
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    authLink
  );

  const cache = new InMemoryCache().restore(initialState || {});

  const client = new ApolloClient({
    headers,
    link,
    cache,
    connectToDevTools: process.browser,
    ssrMode: !process.browser,
    shouldBatch: true,
    resolvers: {
      Mutation: {
        setWait: (_root, { wait }, { cache: c }) => {
          c.writeData({ data: { wait } });
          return null;
        }
      }
    }
  });

  cache.writeData({
    data: {
      wait: false
    }
  });

  return client;
}

export default (headers, token, initialState) => {
  if (!process.browser) {
    return createClient(headers, token, initialState);
  }
  if (!apolloClient) {
    apolloClient = createClient(headers, token, initialState);
  }
  return apolloClient;
};
