import { Toolbar, Box, Divider, Avatar, ListItemAvatar, IconButton, Popover, TextField, Button, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRef, useState } from 'react';
import { useConfirm } from '../../hooks/useConfirm';
import { useEffect } from 'react';
import { Chat } from '@shared/models/chat.model';

type Props = {
  chat: Chat | null;
  onChatDelete: (chatId: string) => void;
  onChatNameChange: (chatId: string, newName: string) => void;
};

export function ChatHeader(props: Props) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { showConfirm, closeConfirm } = useConfirm();
  const [chatNameForEdit, setChatNameForEdit] = useState('');
  const editBtnRef = useRef(null);

  useEffect(() => {
    setChatNameForEdit(props.chat?.name || '');
  }, [props.chat]);

  return (
    <>
      <Toolbar sx={{ marginLeft: '7px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          {props.chat ? (
            <>
              <ListItemAvatar>
                <Avatar alt={props.chat.name} src="/static/images/avatar/1.jpg" />
              </ListItemAvatar>
              {props.chat?.name}
              <IconButton data-testid="edit-chat-name-btn" aria-label="Edit" ref={editBtnRef} onClick={() => setPopoverOpen(true)}>
                <EditIcon />
              </IconButton>
              <Popover
                open={popoverOpen}
                anchorEl={editBtnRef.current}
                onClose={() => setPopoverOpen(false)}
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
                    <Button onClick={() => setPopoverOpen(false)}>Cancel</Button>
                    <Button
                      variant="contained"
                      data-testid="chat-name-edit-submit"
                      onClick={() => {
                        props.chat && props.onChatNameChange(props.chat.id, chatNameForEdit);
                        setPopoverOpen(false);
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
          ) : null}
        </Box>
        <Box sx={{ flexGrow: 0, cursor: 'pointer' }} onClick={() => alert(111)}>
          <Avatar alt={''} src="/static/images/avatar/1.jpg" />
        </Box>
      </Toolbar>
      <Divider />
    </>
  );
}
