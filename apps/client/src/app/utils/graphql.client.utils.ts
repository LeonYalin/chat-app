import { ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject, gql } from '@apollo/client';
import { createFragmentRegistry } from '@apollo/client/cache';
import { ChatFieldsFragmentStr, ChatMessageFieldsFragmentStr, UserFieldsFragmentStr } from '@shared/graphql/fragments';
import fetch from 'cross-fetch';

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

function initClient() {
  return new ApolloClient({
    link: new HttpLink({ uri: 'http://localhost:4000/', fetch }),
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
