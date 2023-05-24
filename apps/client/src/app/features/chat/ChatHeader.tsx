import { Toolbar, Box, Divider, Avatar, ListItemAvatar, IconButton } from '@mui/material';
import { Chat } from './chat.model';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import { ConfirmDialog } from '../../shared/ConfirmDialog';

type Props = {
  chat: Chat | null;
  onChatDelete: (chatId: string) => void;
};

export function ChatHeader(props: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Toolbar sx={{ marginLeft: '7px' }}>
        {props.chat ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <ListItemAvatar>
                <Avatar alt={props.chat?.avatarUrl} src="/static/images/avatar/1.jpg" />
              </ListItemAvatar>
              {props.chat?.name}
              <IconButton aria-label="Edit">
                <EditIcon />
              </IconButton>
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              <IconButton aria-label="Delete" onClick={() => setDialogOpen(true)}>
                <DeleteIcon />
              </IconButton>
              <ConfirmDialog
                title="Delete Chat"
                content="Are you sure you want to delete the chat and all its contents?"
                open={dialogOpen}
                onConfirm={() => {
                  setDialogOpen(false);
                  props.chat && props.onChatDelete(props.chat.id);
                }}
                onCancel={() => setDialogOpen(false)}
              ></ConfirmDialog>
            </Box>
          </>
        ) : null}
      </Toolbar>
      <Divider />
    </>
  );
}
