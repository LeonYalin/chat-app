import { ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject, gql } from '@apollo/client';
import { createFragmentRegistry } from '@apollo/client/cache';
import fetch from 'cross-fetch';

let instance: ApolloClient<NormalizedCacheObject>;

const ChatFieldsFragment = gql`
  fragment ChatFields on Chat {
    id
    name
    avatarUrl
    messages {
      id
      content
      chatUserId
      createdAt
    }
    participants {
      id
      name
      avatarUrl
    }
    createdAt
  }
`;

const ChatMessageFieldsFragment = gql`
  fragment ChatMessageFields on ChatMessage {
    id
    content
    chatUserId
    createdAt
  }
`;

const fragments = [ChatFieldsFragment, ChatMessageFieldsFragment];

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
