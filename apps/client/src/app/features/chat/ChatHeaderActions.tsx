import { ListItemAvatar, Avatar, IconButton, Popover, Typography, TextField, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useRef, useState } from 'react';
import { useConfirm } from '@client/hooks/useConfirm';
import { Chat } from '@shared/models/chat.model';

type Props = {
  chat: Chat | null;
  onChatDelete: (chatId: string) => void;
  onChatNameChange: (chatId: string, newName: string) => void;
};

export function ChatHeaderActions(props: Props) {
  const [editPopoverOpen, setEditPopoverOpen] = useState(false);
  const [chatNameForEdit, setChatNameForEdit] = useState('');
  const { showConfirm, closeConfirm } = useConfirm();
  const editBtnRef = useRef(null);

  useEffect(() => {
    setChatNameForEdit(props.chat?.name || '');
  }, [props.chat]);

  return (
    <>
      <ListItemAvatar>
        <Avatar alt={props.chat?.name} src="/static/images/avatar/1.jpg" />
      </ListItemAvatar>
      {props.chat?.name}
      <IconButton data-testid="edit-chat-name-btn" aria-label="Edit" ref={editBtnRef} onClick={() => setEditPopoverOpen(true)}>
        <EditIcon />
      </IconButton>
      <Popover
        open={editPopoverOpen}
        anchorEl={editBtnRef.current}
        onClose={() => setEditPopoverOpen(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Typography component={'div'} sx={{ p: 2 }}>
          <TextField
            inputProps={{ 'data-testid': 'input-chat-name-edit' }}
            value={chatNameForEdit}
            onChange={e => setChatNameForEdit(e.target.value)}
            label="Chat Name"
            variant="outlined"
            fullWidth
          />
          <Typography component={'div'} sx={{ pt: 2, display: 'flex', justifyContent: 'flex-end', width: '300px' }}>
            <Button onClick={() => setEditPopoverOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              data-testid="chat-name-edit-submit"
              onClick={() => {
                props.chat && props.onChatNameChange(props.chat.id, chatNameForEdit);
                setEditPopoverOpen(false);
              }}
              autoFocus
            >
              OK
            </Button>
          </Typography>
        </Typography>
      </Popover>
      <IconButton
        data-testid="delete-btn"
        aria-label="Delete"
        onClick={() => {
          showConfirm({
            title: 'Delete Chat',
            content: 'Are you sure you want to delete the chat and all its contents?',
            onConfirm: () => {
              props.chat && props.onChatDelete(props.chat.id);
              closeConfirm();
            },
            onCancel: () => {
              closeConfirm();
            },
            onClose: () => {
              /** */
            },
          });
        }}
      >
        <DeleteIcon />
      </IconButton>
    </>
  );
}
