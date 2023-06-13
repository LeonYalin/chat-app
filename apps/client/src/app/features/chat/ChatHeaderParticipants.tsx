import { Autocomplete, Avatar, Box, ListItemAvatar, ListItemText, TextField } from '@mui/material';
import { User } from '@shared/models/user.model';
import { useEffect, useState } from 'react';

type Props = {
  user: User | null;
  participants: User[];
  availableParticipants: User[];
  onParticipantsChange: (participants: User[]) => void;
};

function removeCurrentUser(participants: User[], user: User | null) {
  return participants.filter(p => p.id !== user?.id);
}

function addCurrentUser(participants: User[], user: User | null) {
  const userExists = participants.find(p => p.id === user?.id);
  if (user && !userExists) {
    return [...participants, user];
  }
  return participants;
}

let participants: User[] = [];
let availableParticipants: User[] = [];

export function ChatHeaderParticipants(props: Props) {
  const [selectedParticipants, setSelectedParticipants] = useState<User[]>([]);

  useEffect(() => {
    participants = removeCurrentUser(props.participants || [], props.user);
    availableParticipants = removeCurrentUser(props.availableParticipants, props.user);
    setSelectedParticipants(participants);
  }, [props.availableParticipants, props.participants, props.user]);

  return (
    <Autocomplete
      multiple
      disablePortal
      data-testid="autocomplete-widget"
      options={availableParticipants}
      value={selectedParticipants}
      onChange={(event, newValue) => {
        setSelectedParticipants(newValue);
      }}
      sx={{
        width: '100%',
        '.MuiOutlinedInput-root': {
          padding: '4px',
        },
      }}
      getOptionLabel={option => option.name}
      renderOption={(props, option) => (
        <li {...props} data-testid="autocomplete-option">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ListItemAvatar>
              <Avatar alt={option.name} src={option.avatarUrl} />
            </ListItemAvatar>
            <ListItemText primary={option.name} />
          </Box>
        </li>
      )}
      renderInput={params => <TextField {...params} label="Add Participants" />}
      onBlur={e => {
        if (selectedParticipants.length > 0) {
          props.onParticipantsChange(addCurrentUser(selectedParticipants, props.user));
        }
      }}
    />
  );
}
