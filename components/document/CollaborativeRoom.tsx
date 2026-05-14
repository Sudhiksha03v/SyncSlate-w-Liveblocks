'use client';

import { ClientSideSuspense, RoomProvider } from '@liveblocks/react/suspense'
import { Editor } from '@/components/editor/Editor'
import Header from '@/components/shared/Header'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import ActiveCollaborators from './ActiveCollaborators';
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Link from 'next/link';
import { updateDocument } from '@/lib/actions/room.actions';
import Loader from '@/components/shared/Loader';
import ShareModal from './ShareModal';

const CollaborativeRoom = ({ roomId, roomMetadata, users, currentUserType }: CollaborativeRoomProps) => {
  const [documentTitle, setDocumentTitle] = useState(roomMetadata.title);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateTitleHandler = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Enter') {
      setLoading(true);

      try {
        if(documentTitle !== roomMetadata.title) {
          const updatedDocument = await updateDocument(roomId, documentTitle);
          
          if(updatedDocument) {
            setEditing(false);
          }
        }
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    }
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if(containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setEditing(false);
        updateDocument(roomId, documentTitle);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [roomId, documentTitle])

  useEffect(() => {
    if(editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing])
  

  return (
    <RoomProvider id={roomId}>
      <ClientSideSuspense fallback={<Loader />}>
        <div className="collaborative-room relative flex min-h-screen w-full flex-col bg-[#020408]">
          {/* Background Ambiance */}
          <div className="fixed inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 size-[500px] bg-blue-600/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 right-1/4 size-[500px] bg-purple-600/5 blur-[120px] rounded-full" />
          </div>

          {/* Fixed Header Section */}
          <div className="fixed top-0 left-0 w-full flex flex-col items-center px-4 pt-3 z-50 pointer-events-none">
            <Header className="relative w-full max-w-7xl flex items-center justify-between px-6 py-1.5 rounded-2xl border border-white/10 bg-white/[0.01] backdrop-blur-[32px] shadow-2xl min-h-[56px] pointer-events-auto">
              <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center gap-2 group">
                  <Image 
                    src="/assets/images/logo.png"
                    alt="Logo"
                    width={24}
                    height={24}
                    className="group-hover:rotate-12 transition-transform duration-500" 
                  />
                  <span className="hidden text-base font-black tracking-tighter bg-gradient-to-r from-blue-400 to-white text-transparent bg-clip-text sm:block uppercase">
                    SyncSlate
                  </span>
                </Link>
              </div>
              
              <div ref={containerRef} className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 group/title">
                {editing && !loading ? (
                  <Input 
                    type="text"
                    value={documentTitle}
                    ref={inputRef}
                    placeholder="Enter title"
                    onChange={(e) => setDocumentTitle(e.target.value)}
                    onKeyDown={updateTitleHandler}
                    disabled={!editing}
                    className="document-title-input min-w-[150px] text-center bg-white/5 border-white/10 rounded-lg h-7 text-xs focus:bg-white/10 transition-all !text-white"
                  />
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-text" onClick={() => currentUserType === 'editor' && setEditing(true)}>
                    <p className="document-title truncate max-w-[200px] sm:max-w-md text-center font-bold tracking-tight text-xs sm:text-sm">{documentTitle}</p>
                    {currentUserType === 'editor' && (
                       <Image 
                        src="/assets/icons/edit.svg"
                        alt="edit"
                        width={12}
                        height={12}
                        className="opacity-40"
                      />
                    )}
                  </div>
                )}

                {loading && (
                  <div className="flex items-center gap-2 px-2">
                    <div className="size-1 animate-pulse rounded-full bg-blue-500" />
                    <p className="text-[9px] font-black uppercase tracking-widest text-blue-400/60">Saving</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-4">
                <div className="flex items-center gap-3 pr-2 border-r border-white/10">
                  <ActiveCollaborators />
                  <ShareModal 
                    roomId={roomId}
                    collaborators={users}
                    creatorId={roomMetadata.creatorId}
                    currentUserType={currentUserType}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Link href="/dashboard" className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all text-[9px] font-black uppercase tracking-widest text-white/70 hover:text-white">
                    Go to your docs
                  </Link>
                  <SignedIn>
                    <UserButton appearance={{ elements: { avatarBox: 'size-7 border border-white/10' } }} />
                  </SignedIn>
                </div>
              </div>
            </Header>
          </div>
          
          <div className="w-full pt-28 pb-20">
            <Editor roomId={roomId} currentUserType={currentUserType} />
          </div>
        </div>
      </ClientSideSuspense>
    </RoomProvider>
  )
}

export default CollaborativeRoom