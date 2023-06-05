import type { Meta, StoryObj } from '@storybook/react';
import { ChatsPanel } from './ChatsPanel';
import { Chat } from '@shared/models/chat.model';
import { useState } from 'react';

const meta = {
  title: 'Chats Panel',
  component: ChatsPanel,
} satisfies Meta<typeof ChatsPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    chats: [],
    selectedChat: null,
    panelWidth: 300,
  },
};

const chats: Chat[] = [
  {
    id: '1',
    name: 'Chat 1',
    avatarUrl: 'test',
    messages: [],
    participants: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Chat 2',
    avatarUrl: 'test2',
    messages: [],
    participants: [],
    createdAt: new Date().toISOString(),
  },
];

export const WithChats: Story = {
  args: {
    chats: chats,
    selectedChat: chats[0],
    panelWidth: 300,
  },
};

const ChatsPanelWithHooks = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(chats[0]);
  return (
    <ChatsPanel
      chats={chats}
      selectedChat={selectedChat}
      panelWidth={300}
      onAddChatClick={() => {
        /**/
      }}
      onChatClick={chatId => {
        const chat = chats.find(c => c.id === chatId);
        chat && setSelectedChat(chat);
      }}
    />
  );
};

export const ChangeSelectedChat: Story = {
  render: () => <ChatsPanelWithHooks />,
  args: {
    chats: chats,
    selectedChat: chats[0],
    panelWidth: 300,
  },
};
