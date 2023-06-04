export const ChatFieldsFragmentStr = `
  fragment ChatFields on Chat {
    id
    name
    avatarUrl
    messages {
      id
      content
      chatUserId
      createdAt
    }
    participants {
      id
      name
      avatarUrl
    }
    createdAt
  }
`;

export const ChatMessageFieldsFragmentStr = `
  fragment ChatMessageFields on ChatMessage {
    id
    content
    chatUserId
    createdAt
  }
`;
