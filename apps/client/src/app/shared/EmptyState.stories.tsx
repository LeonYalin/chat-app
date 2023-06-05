import type { Meta, StoryObj } from '@storybook/react';
import AddIcon from '@mui/icons-material/Add';
import { EmptyState } from './EmptyState';
import { Button } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

const meta = {
  title: 'Empty State',
  component: EmptyState,
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const CustomIcon: Story = {
  render: () => <EmptyState icon={<ChatIcon />} />,
};

export const CustomMessages: Story = {
  args: {
    messages: ['Custom message', 'Another custom message'],
  },
};

export const PassChildContent: Story = {
  render: () => (
    <EmptyState messages={['No chats to display']}>
      <Button variant="outlined" startIcon={<AddIcon />} onClick={() => alert('clicked Add Chat')}>
        Add Chat
      </Button>
    </EmptyState>
  ),
};
