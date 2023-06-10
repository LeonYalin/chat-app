// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
export const typeDefs = `
  type Chat {
    id: String!
    name: String!
    avatarUrl: String!
    messages: [ChatMessage!]!
    participants: [User!]!
    createdAt: String!
  }

  input ChatInput {
    id: String!
    name: String!
    avatarUrl: String!
    messages: [ChatMessageInput!]!
    participants: [UserInput!]!
    createdAt: String!
  }

  type ChatMessage {
    id: String!
    content: String!
    userId: String!
    createdAt: String!
  }

  input ChatMessageInput {
    id: String!
    content: String!
    userId: String!
    createdAt: String!
  }

  type ChatMessageOutput {
    chatId: String!
    message: ChatMessage!
  }

  type User {
    id: String!
    name: String!
    email: String!
    password: String!
    avatarUrl: String!
    createdAt: String!
  }

  input UserInput {
    id: String!
    name: String!
    email: String!
    password: String!
    avatarUrl: String!
    createdAt: String!
  }

  type Query {
    loadAllChats: [Chat!]!
    loadChat(chatId: String!): Chat!
    signIn(email: String!, password: String!): User!
  }

  type Mutation {
    addChat(chat: ChatInput!): Chat!
    deleteChat(chatId: String!): String!
    changeChatName(chatId: String!, newName: String!): Chat!
    addChatMessage(chatId: String!, content: String!): ChatMessageOutput!
    signUp(name: String!, email: String!, password: String!): User!
  }
`;
