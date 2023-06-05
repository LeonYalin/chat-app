import type { Meta, StoryObj } from '@storybook/react';
import { ConfirmDialog } from './ConfirmDialog';
import { Chat } from '@shared/models/chat.model';
import { useState } from 'react';

const meta = {
  title: 'Confirm Dialog',
  component: ConfirmDialog,
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
  },
};

export const CustomContent: Story = {
  args: {
    open: true,
    title: 'Custom title',
    content: 'Custom content here',
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Close',
  },
};

export const ClickEvents: Story = {
  args: {
    open: true,
    onCancel: () => alert('Cancel Clicked'),
    onConfirm: () => alert('Confirm Clicked'),
    onClose: () => alert('Backdrop Clicked'),
  },
};
