import { useDialog } from '@client/hooks/useDialog';
import { Box, Avatar, Popover, Typography, List, ListItem, ListItemButton, ListItemText, Divider } from '@mui/material';
import { User } from '@shared/models/user.model';
import { useRef, useState } from 'react';

type Props = {
  user: User | null;
  onSignOut: () => void;
  onUserDelete: () => void;
};

export function ChatHeaderUserMenu(props: Props) {
  const [userMenuPopoverOpen, setUserMenuPopoverOpen] = useState(false);
  const { confirm } = useDialog();
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
        <Typography sx={{ backgroundColor: '#ececec', padding: '8px 40px', textAlign: 'center' }}>{props.user?.name}</Typography>
        <Divider />
        <Typography component={'div'} sx={{ p: 0 }}>
          <List>
            <ListItem
              key={0}
              data-testid="delete-user-btn"
              onClick={() => {
                confirm.show({
                  title: 'Delete User',
                  content: 'Are you sure you want to delete the user from the system?',
                  onConfirm: () => {
                    props.onUserDelete();
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
                confirm.show({
                  title: 'Sign Out',
                  content: 'Are you sure you want to sign out?',
                  onConfirm: () => {
                    props.onSignOut();
                    confirm.close();
                  },
                  onCancel: () => {
                    confirm.close();
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
