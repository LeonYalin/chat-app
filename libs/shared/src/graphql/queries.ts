export const LoadAllChatsQueryStr = `
query LoadAllChats {
    loadAllChats {
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
