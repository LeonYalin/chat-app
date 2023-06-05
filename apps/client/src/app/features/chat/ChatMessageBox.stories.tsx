import type { Meta, StoryObj } from '@storybook/react';
import { ChatMessageBox } from './ChatMessageBox';

const meta = {
  title: 'Chat Message Box',
  component: ChatMessageBox,
} satisfies Meta<typeof ChatMessageBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onChatMessage: (message: string) => {
      alert(message);
    },
  },
};
