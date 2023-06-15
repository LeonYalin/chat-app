import { ApolloClient, split, HttpLink, InMemoryCache, NormalizedCacheObject, gql } from '@apollo/client';
import { createFragmentRegistry } from '@apollo/client/cache';
import { ChatFieldsFragmentStr, ChatMessageFieldsFragmentStr, UserFieldsFragmentStr } from '@shared/graphql/fragments';
import fetch from 'cross-fetch';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

let instance: ApolloClient<NormalizedCacheObject>;

const fragments = [
  gql`
    ${ChatFieldsFragmentStr}
  `,
  gql`
    ${ChatMessageFieldsFragmentStr}
  `,
  gql`
    ${UserFieldsFragmentStr}
  `,
];

const httpLink = new HttpLink({ uri: 'http://localhost:4000/graphql', fetch });

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4000/graphql',
  }),
);

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  httpLink,
);

function initClient() {
  return new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache({
      fragments: createFragmentRegistry(...fragments),
    }),
  });
}

export default function getInstance() {
  if (!instance) {
    instance = initClient();
  }
  return instance;
}
