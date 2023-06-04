export const AddChatMutationStr = `
mutation AddChat($chat: ChatInput!) {
    addChat(chat: $chat) {
      ...ChatFields
    }
  }
`;

export const DeleteChatMutationStr = `
mutation DeleteChat($chatId: String!) {
    deleteChat(chatId: $chatId)
  }
`;

export const ChangeChatNameMutationStr = `
mutation ChangeChatName($chatId: String!, $newName: String!) {
    changeChatName(chatId: $chatId, newName: $newName) {
      ...ChatFields
    }
  }
`;

export const AddChatMessageMutationStr = `
mutation AddChatMessage($chatId: String!, $content: String!) {
    addChatMessage(chatId: $chatId, content: $content) {
      chatId
      message {
        ...ChatMessageFields
      }
    }
  }
`;
