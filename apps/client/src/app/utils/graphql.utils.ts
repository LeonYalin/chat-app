import { ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import fetch from 'cross-fetch';

let instance: ApolloClient<NormalizedCacheObject>;

function initClient() {
  return new ApolloClient({
    link: new HttpLink({ uri: 'https://flyby-router-demo.herokuapp.com/', fetch }),
    cache: new InMemoryCache(),
  });
}

export default function getInstance() {
  if (!instance) {
    instance = initClient();
  }
  return instance;
}