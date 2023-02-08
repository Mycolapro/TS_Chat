import React from 'react';
import RenameButton from './RenameButton';
import DeleteButton from './DeleteButton';
import { useSelector, useDispatch } from 'react-redux';
import { setConversation } from '~/store/convoSlice';
import { setMessages } from '~/store/messageSlice';
import { setText } from '~/store/textSlice';
import manualSWR from '~/utils/fetchers';

export default function Conversation({ id, parentMessageId, title = 'New conversation' }) {
  const dispatch = useDispatch();
  const { conversationId } = useSelector((state) => state.convo);
  const { trigger, isMutating } = manualSWR(`http://localhost:3050/messages/${id}`, 'get');

  const clickHandler = async () => {
    if (conversationId === id) {
      return;
    }

    dispatch(setConversation({ error: false, conversationId: id, parentMessageId }));
    const data = await trigger();
    dispatch(setMessages(data));
    dispatch(setText(''));
  };

  const aProps = {
    className:
      'animate-flash group relative flex cursor-pointer items-center gap-3 break-all rounded-md bg-gray-800 py-3 px-3 pr-14 hover:bg-gray-800'
  };

  if (conversationId !== id) {
    aProps.className =
      'group relative flex cursor-pointer items-center gap-3 break-all rounded-md py-3 px-3 hover:bg-[#2A2B32] hover:pr-4';
  }

  return (
    <a
      onClick={() => clickHandler()}
      {...aProps}
    >
      <svg
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      <div className="relative max-h-5 flex-1 overflow-hidden text-ellipsis break-all">
        {title}
      </div>
      {conversationId === id ? (
        <div className="visible absolute right-1 z-10 flex text-gray-300">
          <RenameButton conversationId={id} />
          <DeleteButton conversationId={id} />
        </div>
      ) : (
        <div className="absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-gray-900 group-hover:from-[#2A2B32]" />
      )}
    </a>
  );
}
