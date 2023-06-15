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
mutation AddChatMessage($chatId: String!, $content: String!, $userName: String!) {
    addChatMessage(chatId: $chatId, content: $content, userName: $userName) {
      chatId
      message {
        ...ChatMessageFields
      }
    }
  }
`;

export const SignUpMutationStr = `
mutation SignUp($name: String!, $email: String!, $password: String!) {
    signUp(name: $name, email: $email, password: $password) {
      ...UserFields
    }
  }
`;

export const DeleteUserMutationStr = `
mutation DeleteUser($userEmail: String!) {
    deleteUser(userEmail: $userEmail)
  }
`;

export const ChangeChatParticipantsMutationStr = `
mutation ChangeChatParticipants($chatId: String!, $participants: [UserInput!]!, $newName: String) {
    changeChatParticipants(chatId: $chatId, participants: $participants, newName: $newName) {
      ...ChatFields
    }
  }
`;
