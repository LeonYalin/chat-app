import { ChatHeader } from './ChatHeader';
import { ChatBody } from './ChatBody';
import { useAppDispatch, useAppSelector } from '@client/hooks';
import { addChatMessageAsync, changeChatNameAsync, deleteChatAsync, loadChatAsync, selectSelectedChat } from './chat.slice';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

export function ChatDetailsMain() {
  const dispatch = useAppDispatch();
  const selectedChat = useAppSelector(selectSelectedChat);
  const { chatId } = useParams();

  useEffect(() => {
    chatId && dispatch(loadChatAsync({ chatId }));
  }, [dispatch, chatId]);

  return (
    <>
      <ChatHeader
        chat={selectedChat}
        onChatDelete={chatId => dispatch(deleteChatAsync({ chatId }))}
        onChatNameChange={(chatId, newName) => dispatch(changeChatNameAsync({ chatId, newName }))}
      ></ChatHeader>
      <ChatBody
        chat={selectedChat}
        onChatMessage={content => dispatch(addChatMessageAsync({ chatId: selectedChat?.id || '', content }))}
      ></ChatBody>
    </>
  );
}
