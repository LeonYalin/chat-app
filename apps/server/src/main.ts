import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { Chat } from '@shared/models/chat.model';

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `
  type Chat {
    id: String!
    name: String!
    avatarUrl: String!
    messages: [ChatMessage!]!
    participants: [ChatUser!]!
    createdAt: String!
  }

  input ChatInput {
    id: String!
    name: String!
    avatarUrl: String!
    messages: [ChatMessageInput!]!
    participants: [ChatUserInput!]!
    createdAt: String!
  }

  type ChatMessage {
    id: String!
    content: String!
    chatUserId: String!
    createdAt: String!
  }

  input ChatMessageInput {
    id: String!
    content: String!
    chatUserId: String!
    createdAt: String!
  }

  type ChatUser {
    id: String!
    name: String!
    avatarUrl: String!
  }

  input ChatUserInput {
    id: String!
    name: String!
    avatarUrl: String!
  }

  type Query {
    chats: [Chat!]!
  }

  type Mutation {
    addChat(chat: ChatInput!): Chat!
  }
`;

const chats: Chat[] = [];

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    chats: () => chats,
  },
  Mutation: {
    addChat: (data, variables: { chat: Chat }) => {
      const chat = variables.chat;
      if (chat) {
        chats.push(chat);
      }
      return chat;
    },
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
async function startServer() {
  const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
  console.log(`🚀 Server listening at: ${url}`);
}
startServer();
