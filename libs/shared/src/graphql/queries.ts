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

export const SignInQueryStr = `
query SignIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      ...UserFields
    }
  }
`;

export const LoadAllUsersQueryStr = `
query LoadAllUsers {
    loadAllUsers {
      ...UserFields
    }
  }
`;
