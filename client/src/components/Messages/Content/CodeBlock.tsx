import copy from 'copy-to-clipboard';
import { DownloadIcon, InfoIcon } from 'lucide-react';
import React, { useRef, useState, RefObject } from 'react';
import Clipboard from '~/components/svg/Clipboard';
import CheckMark from '~/components/svg/CheckMark';
import cn from '~/utils/cn';
import Mermaid from './Mermaid';

type CodeBarProps = {
  lang: string;
  codeRef: RefObject<HTMLElement>;
  plugin?: boolean;
  error?: boolean;
};

type CodeBlockProps = Pick<CodeBarProps, 'lang' | 'plugin' | 'error'> & {
  codeChildren: React.ReactNode;
  classProp?: string;
};

interface languageMap {
  [key: string]: string | undefined;
}

export const programmingLanguages: languageMap = {
  javascript: '.js',
  python: '.py',
  java: '.java',
  c: '.c',
  cpp: '.cpp',
  'c++': '.cpp',
  'c#': '.cs',
  ruby: '.rb',
  php: '.php',
  swift: '.swift',
  'objective-c': '.m',
  kotlin: '.kt',
  typescript: '.ts',
  go: '.go',
  perl: '.pl',
  rust: '.rs',
  scala: '.scala',
  haskell: '.hs',
  lua: '.lua',
  shell: '.sh',
  sql: '.sql',
  html: '.html',
  css: '.css',
  // add more file extensions here, make sure the key is same as language prop in CodeBlock.tsx component
};

export const generateRandomString = (length: number, lowercase = false) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXY3456789'; // excluding similar looking characters like Z, 2, I, 1, O, 0
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return lowercase ? result.toLowerCase() : result;
};

interface MermaidRendererProps {
  value: string;
  mermaidRef: React.Ref<HTMLDivElement>;
}

const MermaidRenderer: React.FC<MermaidRendererProps> = ({ value, mermaidRef }) => {
  return <Mermaid chart={String(value).replace(/\n$/, '')} ref={mermaidRef} />;
};

const CodeBlock: React.FC<CodeBlockProps> = ({
  lang,
  codeChildren,
  classProp = '',
  plugin = null,
  error,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isMermaid, setIsMermaid] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const codeRef = useRef<HTMLElement>(null);
  const mermaidRef = useRef<HTMLDivElement>(null);
  const language = plugin || error ? 'json' : lang;

  const downloadAsFile = () => {
    if (typeof window === 'undefined') {
      return;
    }

    if (isMermaid) {
      const svgElement = mermaidRef.current;
      if (svgElement) {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'mermaid-chart.svg';
        link.click();
        URL.revokeObjectURL(url);
      }
    } else {
      const fileExtension = programmingLanguages[lang] || '.file';
      const suggestedFileName = `file-${generateRandomString(3, true)}${fileExtension}`;
      const fileName = window.prompt('Enter file name' || '', suggestedFileName);

      if (!fileName) {
        // User pressed cancel on prompt.
        return;
      }

      const blob = new Blob([codeRef.current?.textContent || ''], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = fileName;
      link.href = url;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="my-2 w-full rounded-md bg-black text-xs text-white/80">
      <div className="flex w-full items-center rounded-tl-md rounded-tr-md bg-gray-700 px-4 py-2 font-sans text-xs text-gray-200 dark:bg-gray-700">
        <span className="">{lang}</span>
        {plugin ? (
          <InfoIcon className="ml-auto flex h-4 w-4 gap-2 text-white/50" />
        ) : (
          <div className="ml-auto flex items-center gap-4">
            <button
              className={cn('ml-auto flex gap-2', error ? 'h-4 w-4 items-start text-white/50' : '')}
              onClick={async () => {
                const codeString = codeRef.current?.textContent;
                if (codeString) {
                  setIsCopied(true);
                  copy(codeString);

                  setTimeout(() => {
                    setIsCopied(false);
                  }, 3000);
                }
              }}
            >
              {isCopied ? (
                <>
                  <CheckMark />
                  {error ? '' : 'Copied!'}
                </>
              ) : (
                <>
                  <Clipboard />
                  {error ? '' : 'Copy code'}
                </>
              )}
            </button>
            <button
              className={cn('flex gap-2', error ? 'h-4 w-4 items-start text-white/50' : '')}
              onClick={() => {
                downloadAsFile();
              }}
            >
              <DownloadIcon size={16} />
              Download As File
            </button>
            {language === 'mermaid' ||
            language === 'mermaid-flowchart' ||
            language === 'mermaidjs' ? (
                <button
                  className={cn('flex gap-2', error ? 'h-4 w-4 items-start text-white/50' : '')}
                  onClick={() => {
                    setIsMermaid(!isMermaid);
                  }}
                >
                  {isMermaid ? 'Show code' : 'Show diagram'}
                </button>
              ) : null}
            <button
              className={cn('flex gap-2', error ? 'h-4 w-4 items-start text-white/50' : '')}
              onClick={() => {
                setIsCollapsed(!isCollapsed);
              }}
            >
              {isCollapsed ? 'Expand' : 'Collapse'}
            </button>
          </div>
        )}
      </div>
      <div
        className={cn(
          classProp,
          'overflow-y-auto p-4 transition-all duration-500 ease-in-out',
          isCollapsed ? 'max-h-0 overflow-hidden py-0' : 'max-h-[10000px]',
        )}
      >
        {isMermaid ? (
          <MermaidRenderer value={String(codeChildren)} mermaidRef={mermaidRef} />
        ) : (
          <code
            ref={codeRef}
            className={cn(
              plugin || error
                ? '!whitespace-pre-wrap'
                : `hljs language-${language} !whitespace-pre`,
            )}
          >
            {codeChildren}
          </code>
        )}
      </div>
    </div>
  );
};

export default CodeBlock;
