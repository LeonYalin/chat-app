import { useConfirm } from '@client/hooks/useConfirm';
import { Box, Avatar, Popover, Typography, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useRef, useState } from 'react';

type Props = {
  onSignOut: () => void;
  onUserDelete: () => void;
};

export function ChatHeaderUserMenu(props: Props) {
  const [userMenuPopoverOpen, setUserMenuPopoverOpen] = useState(false);
  const { showConfirm, closeConfirm } = useConfirm();
  const userMenuIconRef = useRef(null);

  return (
    <>
      <Box sx={{ flexGrow: 0, cursor: 'pointer' }} onClick={() => setUserMenuPopoverOpen(true)} data-testid="user-menu-icon">
        <Avatar alt={''} src="/static/images/avatar/1.jpg" ref={userMenuIconRef} sx={{ bgcolor: '#9c27b0' }} />
      </Box>
      <Popover
        open={userMenuPopoverOpen}
        anchorEl={userMenuIconRef.current}
        onClose={() => setUserMenuPopoverOpen(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <Typography component={'div'} sx={{ p: 0 }}>
          <List>
            <ListItem
              key={0}
              data-testid="delete-user-btn"
              onClick={() => {
                showConfirm({
                  title: 'Delete User',
                  content: 'Are you sure you want to delete the user from the system?',
                  onConfirm: () => {
                    props.onUserDelete();
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
              sx={{ p: 0 }}
            >
              <ListItemButton>
                <ListItemText primary={'Delete User'} />
              </ListItemButton>
            </ListItem>
            <ListItem
              key={1}
              data-testid="sign-out-btn"
              onClick={() => {
                showConfirm({
                  title: 'Sign Out',
                  content: 'Are you sure you want to sign out?',
                  onConfirm: () => {
                    props.onSignOut();
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
              sx={{ p: 0 }}
            >
              <ListItemButton>
                <ListItemText primary={'Sign Out'} />
              </ListItemButton>
            </ListItem>
          </List>
        </Typography>
      </Popover>
    </>
  );
}
