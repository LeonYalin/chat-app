import { gql } from '@apollo/client';
import gqlClient from '@client/utils/graphql.client.utils';
import { AddChatMessageMutationStr, AddChatMutationStr, ChangeChatNameMutationStr, DeleteChatMutationStr } from '@shared/graphql/mutations';
import { LoadAllChatsQueryStr } from '@shared/graphql/queries';
import { LoadChatQueryStr } from '@shared/graphql/queries';
import { Chat, ChatMessage } from '@shared/models/chat.model';

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

export function addChatMessageApi({ chatId, content }: { chatId: string; content: string }) {
  return gqlClient().mutate<{ addChatMessage: { chatId: string; message: ChatMessage } }>({
    mutation: gql`
      ${AddChatMessageMutationStr}
    `,
    variables: { chatId, content },
  });
}

export function loadAllChatsApi() {
  return gqlClient().query<{ loadAllChats: Chat[] }>({
    query: gql`
      ${LoadAllChatsQueryStr}
    `,
  });
}
