import { ChatHeader } from './ChatHeader';
import { ChatBody } from './ChatBody';
import { useAppDispatch, useAppSelector } from '@client/hooks';
import { addChatMessageAsync, changeChatNameAsync, deleteChatAsync, loadChatAsync, selectSelectedChat } from './chat.slice';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { deleteUserAsync, selectUser, signOutAsync } from '../auth/auth.slice';

export function ChatDetailsMain() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const selectedChat = useAppSelector(selectSelectedChat);
  const user = useAppSelector(selectUser);
  const { chatId } = useParams();

  useEffect(() => {
    chatId && dispatch(loadChatAsync({ chatId }));
  }, [dispatch, chatId]);

  return (
    <>
      <ChatHeader
        chat={selectedChat}
        user={user}
        onChatDelete={chatId => dispatch(deleteChatAsync({ chatId }))}
        onChatNameChange={(chatId, newName) => dispatch(changeChatNameAsync({ chatId, newName }))}
        onSignOut={() => dispatch(signOutAsync({ navigate }))}
        onUserDelete={() => dispatch(deleteUserAsync({ userEmail: user?.email || '', navigate }))}
      ></ChatHeader>
      <ChatBody
        chat={selectedChat}
        onChatMessage={content => dispatch(addChatMessageAsync({ chatId: selectedChat?.id || '', content }))}
      ></ChatBody>
    </>
  );
}
