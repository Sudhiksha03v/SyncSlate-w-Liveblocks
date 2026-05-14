'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
  $createParagraphNode,
  $isRootOrShadowRoot,
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from '@lexical/rich-text';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode,
} from '@lexical/list';
import { $setBlocksType } from '@lexical/selection';
import { $findMatchingParent, $getNearestNodeOfType } from '@lexical/utils';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';

const LowPriority = 1;

function Divider() {
  return <div className="divider" />;
}

type BlockType = 'h1' | 'h2' | 'h3' | 'quote' | 'bullet' | 'number' | 'paragraph';

import { 
  Undo2, Redo2, Heading1, Heading2, Heading3, Quote, 
  Bold, Italic, Underline, Strikethrough, Code, Link2, 
  List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify 
} from 'lucide-react';

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [blockType, setBlockType] = useState<BlockType>('paragraph');
  const activeBlock = useActiveBlock();

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsCode(selection.hasFormat('code'));

      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });
      if (element === null) element = anchorNode.getTopLevelElementOrThrow();

      if ($isListNode(element)) {
        const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode);
        const type = parentList ? parentList.getListType() : element.getListType();
        setBlockType(type as BlockType);
      } else {
        setBlockType('paragraph');
      }
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => $updateToolbar());
      }),
      editor.registerCommand(SELECTION_CHANGE_COMMAND, () => { $updateToolbar(); return false; }, LowPriority),
      editor.registerCommand(CAN_UNDO_COMMAND, (payload) => { setCanUndo(payload); return false; }, LowPriority),
      editor.registerCommand(CAN_REDO_COMMAND, (payload) => { setCanRedo(payload); return false; }, LowPriority),
    );
  }, [editor, $updateToolbar]);

  function toggleBlock(type: 'h1' | 'h2' | 'h3' | 'quote') {
    const selection = $getSelection();
    if (activeBlock === type) {
      return $setBlocksType(selection, () => $createParagraphNode());
    }
    if (type === 'h1') return $setBlocksType(selection, () => $createHeadingNode('h1'));
    if (type === 'h2') return $setBlocksType(selection, () => $createHeadingNode('h2'));
    if (type === 'h3') return $setBlocksType(selection, () => $createHeadingNode('h3'));
    if (type === 'quote') return $setBlocksType(selection, () => $createQuoteNode());
  }

  const formatBulletList = () => {
    if (blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const insertLink = () => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://');
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1" ref={toolbarRef}>
      {/* History */}
      <div className="flex items-center gap-1 px-1 border-r border-white/10">
        <ToolbarButton
          disabled={!canUndo}
          onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={16} />
        </ToolbarButton>
        <ToolbarButton
          disabled={!canRedo}
          onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
          title="Redo (Ctrl+Y)"
        >
          <Redo2 size={16} />
        </ToolbarButton>
      </div>

      {/* Block Styles */}
      <div className="flex items-center gap-1 px-1 border-r border-white/10">
        <ToolbarButton
          onClick={() => editor.update(() => toggleBlock('h1'))}
          active={activeBlock === 'h1'}
          title="Heading 1"
        ><Heading1 size={16} /></ToolbarButton>
        <ToolbarButton
          onClick={() => editor.update(() => toggleBlock('h2'))}
          active={activeBlock === 'h2'}
          title="Heading 2"
        ><Heading2 size={16} /></ToolbarButton>
        <ToolbarButton
          onClick={() => editor.update(() => toggleBlock('h3'))}
          active={activeBlock === 'h3'}
          title="Heading 3"
        ><Heading3 size={16} /></ToolbarButton>
        <ToolbarButton
          onClick={() => editor.update(() => toggleBlock('quote'))}
          active={activeBlock === 'quote'}
          title="Block Quote"
        ><Quote size={16} /></ToolbarButton>
      </div>

      {/* Text Formatting */}
      <div className="flex items-center gap-1 px-1 border-r border-white/10">
        <ToolbarButton
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
          active={isBold}
          title="Bold (Ctrl+B)"
        ><Bold size={16} /></ToolbarButton>
        <ToolbarButton
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
          active={isItalic}
          title="Italic (Ctrl+I)"
        ><Italic size={16} /></ToolbarButton>
        <ToolbarButton
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
          active={isUnderline}
          title="Underline (Ctrl+U)"
        ><Underline size={16} /></ToolbarButton>
        <ToolbarButton
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
          active={isStrikethrough}
          title="Strikethrough"
        ><Strikethrough size={16} /></ToolbarButton>
        <ToolbarButton
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}
          active={isCode}
          title="Inline Code"
        ><Code size={16} /></ToolbarButton>
        <ToolbarButton
          onClick={insertLink}
          active={isLink}
          title="Insert Link"
        ><Link2 size={16} /></ToolbarButton>
      </div>

      {/* Lists */}
      <div className="flex items-center gap-1 px-1 border-r border-white/10">
        <ToolbarButton
          onClick={formatBulletList}
          active={blockType === 'bullet'}
          title="Bullet List"
        ><List size={16} /></ToolbarButton>
        <ToolbarButton
          onClick={formatNumberedList}
          active={blockType === 'number'}
          title="Numbered List"
        ><ListOrdered size={16} /></ToolbarButton>
      </div>

      {/* Alignment */}
      <div className="flex items-center gap-1 px-1">
        <ToolbarButton
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
          title="Align Left"
        ><AlignLeft size={16} /></ToolbarButton>
        <ToolbarButton
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}
          title="Align Center"
        ><AlignCenter size={16} /></ToolbarButton>
        <ToolbarButton
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}
          title="Align Right"
        ><AlignRight size={16} /></ToolbarButton>
        <ToolbarButton
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')}
          title="Justify"
        ><AlignJustify size={16} /></ToolbarButton>
      </div>
    </div>
  );
}

const ToolbarButton = ({ 
  children, 
  onClick, 
  active, 
  disabled, 
  title 
}: { 
  children: React.ReactNode, 
  onClick?: () => void, 
  active?: boolean, 
  disabled?: boolean,
  title?: string
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      title={title}
      className={`
        relative flex items-center justify-center size-8 rounded-lg transition-all duration-200
        ${active 
          ? 'bg-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
          : 'text-gray-400 hover:bg-white/5 hover:text-white'
        }
        ${disabled ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer active:scale-90'}
      `}
    >
      {children}
    </button>
  );
};

function useActiveBlock() {
  const [editor] = useLexicalComposerContext();

  const subscribe = useCallback(
    (onStoreChange: () => void) => editor.registerUpdateListener(onStoreChange),
    [editor],
  );

  const getSnapshot = useCallback(() => {
    return editor.getEditorState().read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return null;

      const anchor = selection.anchor.getNode();
      let element =
        anchor.getKey() === 'root'
          ? anchor
          : $findMatchingParent(anchor, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) element = anchor.getTopLevelElementOrThrow();

      if ($isHeadingNode(element)) return element.getTag();
      return element.getType();
    });
  }, [editor]);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
