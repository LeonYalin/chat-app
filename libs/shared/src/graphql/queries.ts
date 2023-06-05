export const LoadChatsQueryStr = `
query LoadChats {
    chats {
      ...ChatFields
    }
  }
`;

export const LoadChatQueryStr = `
query LoadChat($chatId: String!) {
    loadChat(chatId: $chatId) {
    ...ChatFields
    }
  }
`;
