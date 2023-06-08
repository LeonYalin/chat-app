import { ApolloServer, GraphQLResponse } from '@apollo/server';
import { Chat, createChatMessage } from '@shared/models/chat.model';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import db from './db.utils';

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
export const typeDefs = `
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

  type ChatMessageOutput {
    chatId: String!
    message: ChatMessage!
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
    loadAllChats: [Chat!]!
    loadChat(chatId: String!): Chat!
  }

  type Mutation {
    addChat(chat: ChatInput!): Chat!
    deleteChat(chatId: String!): String!
    changeChatName(chatId: String!, newName: String!): Chat!
    addChatMessage(chatId: String!, content: String!): ChatMessageOutput!
  }
`;

export const resolvers = {
  Query: {
    loadAllChats: async () => {
      try {
        const chats: Chat[] = await db().getObjectDefault<Chat[]>('/chats', []);
        return chats;
      } catch (err) {
        throwGqlError(err);
      }
    },
    loadChat: async (data, variables: { chatId: string }) => {
      const chats: Chat[] = await db().getObjectDefault<Chat[]>('/chats', []);
      const { chatId } = variables;
      if (chatId) {
        const chat = chats.find(chat => chat.id === chatId);
        if (!chat) {
          throwGqlError('Chat not found');
        } else {
          return chat;
        }
      } else {
        throwGqlError();
      }
    },
  },
  Mutation: {
    addChat: async (data, variables: { chat: Chat }) => {
      try {
        const { chat } = variables;
        if (chat) {
          await db().push('/chats[]', chat);
          return chat;
        } else {
          throwGqlError();
        }
      } catch (err) {
        throwGqlError(err);
      }
    },
    deleteChat: async (data, variables: { chatId: string }) => {
      const chats: Chat[] = await db().getObjectDefault<Chat[]>('/chats', []);
      const { chatId } = variables;
      if (chatId) {
        const index = chats.findIndex(chat => chat.id === chatId);
        if (index === -1) {
          throwGqlError('Chat not found');
        } else {
          await db().delete(`/chats[${index}]`);
          return chatId;
        }
      } else {
        throwGqlError();
      }
    },
    changeChatName: async (data, variables: { chatId: string; newName: string }) => {
      try {
        const chats: Chat[] = await db().getObjectDefault<Chat[]>('/chats', []);
        const { chatId, newName } = variables;
        if (chatId && newName) {
          const index = chats.findIndex(chat => chat.id === chatId);
          if (index > -1) {
            await db().push(`/chats[${index}]/name`, newName);
          } else {
            throwGqlError('Chat not found');
          }
          return chats[index];
        } else {
          throwGqlError();
        }
      } catch (err) {
        throwGqlError(err);
      }
    },
    addChatMessage: async (data, variables: { chatId: string; content: string }) => {
      try {
        const chats: Chat[] = await db().getObjectDefault<Chat[]>('/chats', []);
        const { chatId, content } = variables;
        const index = chats.findIndex(chat => chat.id === chatId);
        if (index > -1 && content) {
          const message = createChatMessage({ content });
          await db().push(`/chats[${index}]/messages[]`, message);
          return { chatId, message };
        } else {
          throwGqlError();
        }
      } catch (err) {
        throwGqlError(err);
      }
    },
  },
};

function throwGqlError(text = 'Invalid argument value', code = 'BAD_USER_INPUT') {
  throw new GraphQLError(text, { extensions: { code } });
}

export function createApolloTestingServer() {
  return new ApolloServer({
    typeDefs: gql`
      ${typeDefs}
    `,
    resolvers,
  });
}

export function getResponseData<T>(response: GraphQLResponse) {
  const result = (response.body as any).singleResult;
  const data = result.data as T;
  const errors = result.errors as GraphQLError[];
  return { data, errors };
}
