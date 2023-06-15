export const MessageAddedSubscriptionStr = `
  subscription MessageAdded {
    messageAdded {
        chatId
        message {
          id
          content
          userName
          createdAt
        }
    }
  }
`;

export const MESSAGE_ADDED_TOPIC = 'MESSAGE_ADDED_TOPIC';
