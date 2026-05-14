'use client';

import Theme from './plugins/Theme';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import React from 'react';

import { FloatingComposer, FloatingThreads, liveblocksConfig, LiveblocksPlugin, useEditorStatus } from '@liveblocks/react-lexical'
import Loader from '@/components/shared/Loader';

import FloatingToolbarPlugin from './plugins/FloatingToolbarPlugin'
import { useThreads } from '@liveblocks/react/suspense';
import Comments from '@/components/document/Comments';
import { DeleteModal } from '@/components/document/DeleteModal';

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.

function Placeholder() {
  return <div className="editor-placeholder">Enter some rich text...</div>;
}

export function Editor({ roomId, currentUserType }: { roomId: string, currentUserType: UserType }) {
  const status = useEditorStatus();
  const { threads } = useThreads();

  const initialConfig = liveblocksConfig({
    namespace: 'Editor',
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode, AutoLinkNode],
    onError: (error: Error) => {
      console.error(error);
      throw error;
    },
    theme: Theme,
    editable: currentUserType === 'editor',
  });

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container relative flex flex-col items-center w-full">
        {/* Toolbar - Floating Deck (Now with Delete Option) */}
        <div className="flex w-full justify-center px-4 mb-8 z-40">
          <div className="flex w-full max-w-7xl justify-between items-center px-6 py-1 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl">
            <div className="flex items-center">
              <ToolbarPlugin />
            </div>
            {currentUserType === 'editor' && (
              <div className="pl-4 border-l border-white/10">
                <DeleteModal roomId={roomId} />
              </div>
            )}
          </div>
        </div>

        {/* Workspace - Centered Editor with Side Comments */}
        <div className="flex justify-center w-full px-4">
          <div className="flex w-full max-w-7xl gap-8">
            {/* Main Editor Area */}
            <div className="flex-1 flex justify-center">
              <div className="w-full max-w-[800px] relative">
                {status === 'not-loaded' || status === 'loading' ? (
                  <div className="flex h-[400px] items-center justify-center">
                    <Loader />
                  </div>
                ) : (
                  <div className="editor-inner relative min-h-[1100px] w-full bg-[#09111f]/40 backdrop-blur-sm border border-white/5 rounded-[2.5rem] shadow-2xl">
                    <RichTextPlugin
                      contentEditable={
                        <ContentEditable className="editor-input outline-none text-gray-200 text-lg leading-relaxed selection:bg-blue-500/30" />
                      }
                      placeholder={<Placeholder />}
                      ErrorBoundary={LexicalErrorBoundary}
                    />
                    {currentUserType === 'editor' && <FloatingToolbarPlugin />}
                    <ListPlugin />
                    <LinkPlugin />
                    <HistoryPlugin />
                    <AutoFocusPlugin />
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Comments Area */}
            <div className="hidden xl:flex w-[350px] flex-col gap-6">
               <div className="flex items-center gap-2 mb-2">
                  <div className="size-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Collaborative Threads</span>
               </div>
               <LiveblocksPlugin>
                  <FloatingComposer className="w-full !bg-white/[0.02] !border-white/10 !rounded-2xl !shadow-none" />
                  <FloatingThreads threads={threads} />
                  <Comments />
               </LiveblocksPlugin>
            </div>
          </div>
        </div>
      </div>
    </LexicalComposer>
  );
}