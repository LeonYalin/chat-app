export const ChatFieldsFragmentStr = `
  fragment ChatFields on Chat {
    id
    name
    avatarUrl
    messages {
      ...ChatMessageFields
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
    userName
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
