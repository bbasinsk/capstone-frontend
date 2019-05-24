import ws from 'ws';
import { ApolloLink, split, concat } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

const WS_URL = 'wss://meeting-magic-backend.herokuapp.com/v1alpha1/graphql';
const HTTP_URL = 'https://meeting-magic-backend.herokuapp.com/v1alpha1/graphql';

export default ({ meetingId }) => {
  const headers = {
    ...(meetingId && { 'meeting-id': meetingId })
  };

  const httpLink = createHttpLink({
    uri: HTTP_URL,
    credentials: 'include'
  });

  const wsLink = new WebSocketLink({
    uri: WS_URL,
    options: {
      reconnect: true,
      connectionParams: { headers }
    },
    webSocketImpl: process.browser ? undefined : ws
  });

  const authMiddleware = new ApolloLink((operation, forward) => {
    operation.setContext({ headers });
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
