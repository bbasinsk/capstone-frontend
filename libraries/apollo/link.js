import ws from 'ws';
import { ApolloLink, split, concat } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

export default ({ accessToken }) => {
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

  const authMiddleware = new ApolloLink((operation, forward) => {
    operation.setContext({
      headers: {
        ...(accessToken && { authorization: `Bearer ${accessToken}` })
      }
    });
    return forward(operation);
  });

  return split(
    // split based on operation type
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    concat(authMiddleware, httpLink)
  );
};
