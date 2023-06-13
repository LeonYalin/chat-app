import { ChatHeader } from './ChatHeader';
import { ChatBody } from './ChatBody';
import { useAppDispatch, useAppSelector } from '@client/hooks';
import {
  addChatMessageAsync,
  changeChatNameAsync,
  deleteChatAsync,
  loadChatAsync,
  selectSelectedChat,
  changeChatParticipantsAsync,
} from './chat.slice';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { deleteUserAsync, selectAllUsers, selectUser, signOutAsync } from '../auth/auth.slice';
import { omit } from 'lodash';

export function ChatDetailsMain() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const selectedChat = useAppSelector(selectSelectedChat);
  const user = useAppSelector(selectUser);
  const allUsers = useAppSelector(selectAllUsers);
  const { chatId } = useParams();
  const [participantsEmpty, setParticipantsEmpty] = useState<boolean>(true);

  useEffect(() => {
    chatId && dispatch(loadChatAsync({ chatId }));
  }, [dispatch, chatId]);

  useEffect(() => {
    selectedChat && selectedChat.participants.length < 2 ? setParticipantsEmpty(true) : setParticipantsEmpty(false);
  }, [selectedChat]);

  return (
    <>
      <ChatHeader
        chat={selectedChat}
        user={user}
        allUsers={allUsers}
        participantsEmpty={participantsEmpty}
        onChatDelete={chatId => dispatch(deleteChatAsync({ chatId, navigate }))}
        onChatNameChange={(chatId, newName) => dispatch(changeChatNameAsync({ chatId, newName }))}
        onSignOut={() => dispatch(signOutAsync({ navigate }))}
        onUserDelete={() => dispatch(deleteUserAsync({ userEmail: user?.email || '', navigate }))}
        onParticipantsChange={iparticipants => {
          const newName = iparticipants
            .filter(p => p.id !== user?.id)
            .map(participant => participant.name)
            .join(', ');
          const participants = iparticipants.map(participant => omit({ ...participant, email: '', password: '' }, '__typename'));
          chatId && dispatch(changeChatParticipantsAsync({ chatId, participants, newName }));
        }}
      ></ChatHeader>
      <ChatBody
        chat={selectedChat}
        participantsEmpty={participantsEmpty}
        onChatMessage={content => dispatch(addChatMessageAsync({ chatId: selectedChat?.id || '', content }))}
      ></ChatBody>
    </>
  );
}
