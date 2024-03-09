/* eslint-disable react-hooks/exhaustive-deps */
import { useGetConversationByIdQuery } from 'librechat-data-provider/react-query';
import { useEffect } from 'react';
import { useSetRecoilState, useRecoilState, useRecoilValue } from 'recoil';
import copy from 'copy-to-clipboard';
import { SubRow, Plugin, MessageContent } from './Content';
// eslint-disable-next-line import/no-cycle
import MultiMessage from './MultiMessage';
import HoverButtons from './HoverButtons';
import { cn } from '~/utils';
import React, { useState } from 'react';
import { BingSuggestionCard } from './Content/BingSuggestions';
import { SandpackProvider } from '@codesandbox/sandpack-react';
import { amethyst } from '@codesandbox/sandpack-themes';
import { useMessageHelpers } from '~/hooks';
import SiblingSwitch from './SiblingSwitch';

export default function Message(props: TMessageProps) {
  const [files, setFiles] = useState({});
  const { message, siblingIdx, siblingCount, setSiblingIdx, currentEditId, setCurrentEditId } =
    props;

  const [bingSuggestions, setBingSuggestions] = useState<string[]>([]);

  const {
    ask,
    icon,
    edit,
    isLast,
    enterEdit,
    handleScroll,
    conversation,
    isSubmitting,
    latestMessage,
    handleContinue,
    copyToClipboard,
    regenerateMessage,
  } = useMessageHelpers(props);

  const { text, children, messageId = null, isCreatedByUser, error, unfinished } = message ?? {};

  // bing suggestions
  useEffect(() => {
    if (!message || !message.suggestions) {
      return;
    }
    setBingSuggestions(message.suggestions);
    console.log(message.suggestions);
  }, [message]);

  if (!message) {
    return null;
  }

  const enterEdit = (cancel?: boolean) =>
    setCurrentEditId && setCurrentEditId(cancel ? -1 : messageId);

  const handleScroll = () => {
    if (isSubmitting) {
      setAbortScroll(true);
    } else {
      setAbortScroll(false);
    }
  };

  const commonClasses =
    'w-full border-b text-gray-800 group border-black/10 dark:border-gray-800/50 dark:text-gray-200';
  const uniqueClasses = isCreatedByUser
    ? 'bg-white dark:bg-gray-800 dark:text-gray-20'
    : 'bg-gray-50 dark:bg-gray-700 dark:text-gray-100';

  const messageProps = {
    className: cn(commonClasses, uniqueClasses),
    titleclass: '',
  };

  const icon = Icon({
    ...conversation,
    ...message,
    model: message?.model ?? conversation?.model,
    size: 36,
  });

  if (message?.bg && searchResult) {
    messageProps.className = message?.bg?.split('hover')[0];
    messageProps.titleclass = message?.bg?.split(messageProps.className)[1] + ' cursor-pointer';
  }

  const regenerateMessage = () => {
    if (!isSubmitting && !isCreatedByUser) {
      regenerate(message);
    }
  };

  const copyToClipboard = (setIsCopied: React.Dispatch<React.SetStateAction<boolean>>) => {
    setIsCopied(true);
    copy(text ?? '');

    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  const clickSearchResult = async () => {
    if (!searchResult) {
      return;
    }
    if (!message) {
      return;
    }
    const response = await getConversationQuery.refetch({
      queryKey: [message?.conversationId],
    });

    console.log('getConversationQuery response.data:', response.data);

    if (response.data) {
      switchToConversation(response.data);
    }
  };

  return (
    <>
      <div
        className="text-token-text-primary w-full border-0 bg-transparent dark:border-0 dark:bg-transparent"
        onWheel={handleScroll}
        onTouchMove={handleScroll}
      >
        <div className="m-auto justify-center p-4 py-2 text-base md:gap-6 ">
          <div className="} group mx-auto flex flex-1 flex-col gap-3 text-base md:max-w-3xl md:px-5 lg:max-w-[40rem] lg:px-1 xl:max-w-[48rem] xl:px-5">
            <div
              className={cn('relative flex w-full flex-col', isCreatedByUser ? '' : 'agent-turn')}
            >
              <div className="my-4 flex select-none flex-row items-start gap-3 font-semibold">
                <div className="relative flex flex-shrink-0 flex-col items-end">
                  <div>
                    <div className="pt-0.5">
                      <div className="gizmo-shadow-stroke flex h-6 w-6 items-center justify-center overflow-hidden rounded-full">
                        {typeof icon === 'string' && /[^\\x00-\\x7F]+/.test(icon as string) ? (
                          <span className=" direction-rtl w-40 overflow-x-scroll">{icon}</span>
                        ) : (
                          icon
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {isCreatedByUser ? 'You' : message.sender}
              </div>
              <div className="flex-col gap-1 md:gap-3">
                <div className="flex max-w-full flex-grow flex-col gap-0">
                  {/* Legacy Plugins */}
                  {message?.plugin && <Plugin plugin={message?.plugin} />}
                  <MessageContent
                    ask={ask}
                    edit={edit}
                    isLast={isLast}
                    text={text ?? ''}
                    message={message}
                    enterEdit={enterEdit}
                    error={!!error}
                    isSubmitting={isSubmitting}
                    unfinished={unfinished ?? false}
                    isCreatedByUser={isCreatedByUser ?? true}
                    siblingIdx={siblingIdx ?? 0}
                    setSiblingIdx={
                      setSiblingIdx ??
                      (() => {
                        return;
                      })
                    }
                  />
                </div>
              </div>
              {Object.keys(files).length > 0 && (
                <SandpackProvider
                  template="static"
                  options={{
                    autoReload: true,
                    autorun: true,
                    recompileMode: 'delayed',
                    recompileDelay: 300,
                  }}
                  files={files}
                  theme={amethyst}
                ></SandpackProvider>
              )}
              {isLast && isSubmitting ? null : (
                <SubRow classes="text-xs flex-col gap-2 pt-4">
                  {bingSuggestions.length > 0 && (
                    <div className="flex w-full flex-col gap-4 md:flex-row">
                      {bingSuggestions.map((suggestion, index) => (
                        <BingSuggestionCard
                          key={index}
                          suggestion={suggestion}
                          onClick={() => ask({ text: suggestion })}
                        />
                      ))}
                    </div>
                  )}
                  <div className="flex flex-row items-start justify-start gap-2">
                    <SiblingSwitch
                      siblingIdx={siblingIdx}
                      siblingCount={siblingCount}
                      setSiblingIdx={setSiblingIdx}
                    />
                    <HoverButtons
                      isEditing={edit}
                      message={message}
                      enterEdit={enterEdit}
                      isSubmitting={isSubmitting}
                      conversation={conversation ?? null}
                      regenerate={() => regenerateMessage()}
                      copyToClipboard={copyToClipboard}
                      handleContinue={handleContinue}
                      latestMessage={latestMessage}
                    />
                  </div>
                </SubRow>
              )}
            </div>
          </div>
        </div>
      </div>
      <MultiMessage
        key={messageId}
        messageId={messageId}
        conversation={conversation}
        messagesTree={children ?? []}
        currentEditId={currentEditId}
        setCurrentEditId={setCurrentEditId}
      />
    </>
  );
}
