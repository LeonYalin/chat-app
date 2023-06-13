export const ChatFieldsFragmentStr = `
  fragment ChatFields on Chat {
    id
    name
    avatarUrl
    messages {
      id
      content
      userId
      createdAt
    }
    participants {
      ...UserFields
    }
    createdAt
  }
`;

export const ChatMessageFieldsFragmentStr = `
  fragment ChatMessageFields on ChatMessage {
    id
    content
    userId
    createdAt
  }
`;

export const UserFieldsFragmentStr = `
  fragment UserFields on User {
    id
    name
    email
    password
    avatarUrl
    createdAt
  }
`;
