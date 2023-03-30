import { clsx } from 'clsx';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import GPTIcon from '../components/svg/GPTIcon';
import BingIcon from '../components/svg/BingIcon';

const getIcon = props => {
  // { size = 30, isCreatedByUser, model, chatGptLabel, error, ...props }
  const { size = 30, isCreatedByUser, button } = props;

  if (isCreatedByUser)
    return (
      <div
        title="User"
        style={{
          background: 'radial-gradient(circle at 90% 110%, rgb(1 43 128), rgb(17, 139, 161))',
          color: 'white',
          fontSize: 12,
          width: size,
          height: size
        }}
        className={`relative flex items-center justify-center rounded-sm text-white ` + props?.className}
      >
        User
      </div>
    );
  else if (!isCreatedByUser) {
    const { endpoint, error } = props;

    let icon, bg, name;
    if (endpoint === 'azureOpenAI') {
      const { chatGptLabel } = props;

      icon = <GPTIcon size={size * 0.7} />;
      bg = 'linear-gradient(0.375turn, #61bde2, #4389d0)';
      name = chatGptLabel || 'ChatGPT';
    } else if (endpoint === 'openAI') {
      const { chatGptLabel } = props;

      icon = <GPTIcon size={size * 0.7} />;
      bg = chatGptLabel
        ? `rgba(16, 163, 127, ${button ? 0.75 : 1})`
        : `rgba(16, 163, 127, ${button ? 0.75 : 1})`;
      name = chatGptLabel || 'ChatGPT';
    } else if (endpoint === 'bingAI') {
      const { jailbreak } = props;

      icon = <BingIcon size={size * 0.7} />;
      bg = jailbreak ? `radial-gradient(circle at 90% 110%, #F0F0FA, #D0E0F9)` : `transparent`;
      name = jailbreak ? 'Sydney' : 'BingAI';
    } else if (endpoint === 'chatGPTBrowser') {
      icon = <GPTIcon size={size * 0.7} />;
      bg = `rgba(0, 163, 255, ${button ? 0.75 : 1})`;
      name = 'ChatGPT';
    } else if (endpoint === null) {
      icon = <GPTIcon size={size * 0.7} />;
      bg = `grey`;
      name = 'N/A';
    } else {
      icon = <GPTIcon size={size * 0.7} />;
      bg = `grey`;
      name = 'UNKNOWN';
    }

    return (
      <div
        title={name}
        style={{
          background: bg || 'transparent',
          width: size,
          height: size
        }}
        className={`relative flex items-center justify-center rounded-sm text-white ` + props?.className}
      >
        {icon}
        {error && (
          <span className="absolute right-0 top-[20px] -mr-2 flex h-4 w-4 items-center justify-center rounded-full border border-white bg-red-500 text-[10px] text-white">
            !
          </span>
        )}
      </div>
    );
  }
};

export default getIcon;
