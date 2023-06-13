import { Chat, createChatMessage } from '@shared/models/chat.model';
import db from '../db.utils';
import { throwGqlDefaultError, throwGqlError } from './graphql.server.utils';
import { User, createUser } from '@shared/models/user.model';
import { comparePasswordAndHash, hashPassword } from '../crypto.utils';

export const resolvers = {
  Query: {
    loadAllChats: async () => {
      try {
        const chats: Chat[] = await db().getObjectDefault<Chat[]>('/chats', []);
        return chats;
      } catch (err) {
        throwGqlDefaultError(err);
      }
    },
    loadChat: async (data, variables: { chatId: string }) => {
      try {
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
      } catch (err) {
        throwGqlDefaultError(err);
      }
    },
    signIn: async (data, variables: { email: string; password: string }) => {
      try {
        const users: User[] = await db().getObjectDefault<User[]>('/users', []);
        const validUser = users.find(user => user.email === variables.email);
        if (validUser) {
          const validPassword = await comparePasswordAndHash(variables.password, validUser.password).catch(err => {
            throwGqlDefaultError(err);
          });
          if (validPassword) {
            return validUser;
          } else {
            throwGqlError('Invalid password');
          }
        } else {
          throwGqlError('User not found');
        }
      } catch (err) {
        throwGqlDefaultError(err);
      }
    },
    loadAllUsers: async () => {
      try {
        const allUsers: User[] = await db().getObjectDefault<User[]>('/users', []);
        return allUsers;
      } catch (err) {
        throwGqlDefaultError(err);
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
        throwGqlDefaultError(err);
      }
    },
    deleteChat: async (data, variables: { chatId: string }) => {
      try {
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
      } catch (err) {
        throwGqlDefaultError(err);
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
        throwGqlDefaultError(err);
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
        throwGqlDefaultError(err);
      }
    },
    signUp: async (data, variables: { name: string; email: string; password: string }) => {
      try {
        const users: User[] = await db().getObjectDefault<User[]>('/users', []);
        const user = users.find(user => user.email === variables.email);
        if (user) {
          throwGqlError('Email already exists');
        } else {
          const hashedPassword = await hashPassword(variables.password).catch(err => {
            throwGqlDefaultError(err);
          });
          const newUser = createUser({ name: variables.name, email: variables.email, password: hashedPassword || '' });
          await db().push('/users[]', newUser);
          return newUser;
        }
      } catch (err) {
        throwGqlDefaultError(err);
      }
    },
    deleteUser: async (data, variables: { userEmail: string }) => {
      try {
        const users: User[] = await db().getObjectDefault<User[]>('/users', []);
        const { userEmail } = variables;
        if (userEmail) {
          const index = users.findIndex(chat => chat.email === userEmail);
          if (index === -1) {
            throwGqlError('User not found');
          } else {
            await db().delete(`/users[${index}]`);
            return userEmail;
          }
        } else {
          throwGqlError();
        }
      } catch (err) {
        throwGqlDefaultError(err);
      }
    },
    changeChatParticipants: async (data, variables: { chatId: string; participants: User[]; newName?: string }) => {
      try {
        const chats: Chat[] = await db().getObjectDefault<Chat[]>('/chats', []);
        const { chatId, participants, newName } = variables;
        if (chatId && participants) {
          const index = chats.findIndex(chat => chat.id === chatId);
          if (index > -1) {
            await db().push(`/chats[${index}]/participants`, participants);
            newName && (await db().push(`/chats[${index}]/name`, newName));
          } else {
            throwGqlError('Chat not found');
          }
          return chats[index];
        } else {
          throwGqlError();
        }
      } catch (err) {
        throwGqlDefaultError(err);
      }
    },
  },
};
