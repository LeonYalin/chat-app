import { gql } from '@apollo/client';
import gqlClient from '@client/utils/graphql.client.utils';
import {
  AddChatMessageMutationStr,
  AddChatMutationStr,
  ChangeChatNameMutationStr,
  ChangeChatParticipantsMutationStr,
  DeleteChatMutationStr,
} from '@shared/graphql/mutations';
import { MessageAddedSubscriptionStr } from '@shared/graphql/subscriptions';
import { LoadAllChatsQueryStr } from '@shared/graphql/queries';
import { LoadChatQueryStr } from '@shared/graphql/queries';
import { Chat, ChatMessage } from '@shared/models/chat.model';
import { User } from '@shared/models/user.model';

export function addChatApi({ chat }: { chat: Chat }) {
  return gqlClient().mutate<{ addChat: Chat }>({
    mutation: gql`
      ${AddChatMutationStr}
    `,
    variables: { chat },
  });
}

export function loadChatApi({ chatId }: { chatId: string }) {
  return gqlClient().query<{ loadChat: Chat }>({
    query: gql`
      ${LoadChatQueryStr}
    `,
    variables: { chatId },
  });
}

export function deleteChatApi({ chatId }: { chatId: string }) {
  return gqlClient().mutate<{ deleteChat: string }>({
    mutation: gql`
      ${DeleteChatMutationStr}
    `,
    variables: { chatId },
  });
}

export function changeChatNameApi({ chatId, newName }: { chatId: string; newName: string }) {
  return gqlClient().mutate<{ changeChatName: Chat }>({
    mutation: gql`
      ${ChangeChatNameMutationStr}
    `,
    variables: { chatId, newName },
  });
}

export function addChatMessageApi({ chatId, content, userName }: { chatId: string; content: string; userName: string }) {
  return gqlClient().mutate<{ addChatMessage: { chatId: string; message: ChatMessage; userName: string } }>({
    mutation: gql`
      ${AddChatMessageMutationStr}
    `,
    variables: { chatId, content, userName },
  });
}

export function loadAllChatsApi() {
  return gqlClient().query<{ loadAllChats: Chat[] }>({
    query: gql`
      ${LoadAllChatsQueryStr}
    `,
  });
}

export function changeChatParticipantsApi({ chatId, participants, newName }: { chatId: string; participants: User[]; newName?: string }) {
  return gqlClient().mutate<{ changeChatParticipants: Chat }>({
    mutation: gql`
      ${ChangeChatParticipantsMutationStr}
    `,
    variables: { chatId, participants, newName },
  });
}

export function messageAddedSubscriptionApi() {
  return gqlClient().subscribe<{ messageAdded: { chatId: string; message: ChatMessage } }>({
    query: gql`
      ${MessageAddedSubscriptionStr}
    `,
    variables: {},
  });
}
