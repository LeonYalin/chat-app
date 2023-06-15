import { PubSub } from 'graphql-subscriptions';

let pubSubInstance: PubSub;

function initPubSub() {
  return new PubSub();
}

export default function getPubSubInstance() {
  if (!pubSubInstance) {
    pubSubInstance = initPubSub();
  }
  return pubSubInstance;
}
