import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import getApolloLink from './link';
import persist from '../persist';

function createClient(headers, token, initialState, meetingId) {
  let accessToken = token;

  (async () => {
    // eslint-disable-next-line no-param-reassign
    accessToken = token || (await persist.willGetAccessToken());
  })();

  const cache = new InMemoryCache().restore(initialState || {});

  const client = new ApolloClient({
    headers,
    cache,
    link: getApolloLink({ accessToken, meetingId }),
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

export default createClient;
