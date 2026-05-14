import AddDocumentBtn from '@/components/document/AddDocumentBtn';
import { DeleteModal } from '@/components/document/DeleteModal';
import Header from '@/components/shared/Header'
import Notifications from '@/components/shared/Notifications';
import { getDocuments } from '@/lib/actions/room.actions';
import { dateConverter, getUserColor } from '@/lib/utils';
import { SignedIn, UserButton } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FileText, Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

const Dashboard = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect('/sign-in');

interface RoomDocument {
  id: string;
  metadata: {
    title: string;
    creatorId: string;
    email: string;
  };
  createdAt: string;
}

interface ImportedRoomData {
  id: string;
  metadata: {
    title: string;
    creatorId: string;
    email: string;
  };
  createdAt: string;
}

const documentsResponse = await getDocuments(clerkUser.emailAddresses[0].emailAddress);
const roomDocuments: RoomDocument[] = documentsResponse ? (documentsResponse.data as unknown as ImportedRoomData[]).map((doc: ImportedRoomData) => ({
  id: doc.id,
  metadata: {
    title: doc.metadata.title,
    creatorId: doc.metadata.creatorId,
    email: doc.metadata.email,
  },
  createdAt: doc.createdAt,
})) : [];

  return (
    <main className="relative min-h-screen bg-[#050810] text-white overflow-hidden">
      {/* Background blobs for dashboard consistency */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

      <Header className="sticky left-0 top-0 z-50 backdrop-blur-md bg-[#050810]/70 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 group transition-all">
          <Image 
            src="/assets/images/logo.png"
            alt="Logo"
            width={32}
            height={32}
            className="group-hover:rotate-12 transition-transform" 
          />
          <span className="hidden text-xl font-bold bg-gradient-to-r from-blue-300 to-white text-transparent bg-clip-text sm:block">
            SyncSlate
          </span>
        </Link>
        <div className="flex items-center gap-2 lg:gap-4">
          <Notifications />
          <SignedIn>
            <UserButton appearance={{ elements: { userButtonAvatarBox: 'size-9 border border-white/10' } }} />
          </SignedIn>
        </div>
      </Header>

      <div className="relative z-10 max-w-6xl mx-auto py-12 px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2">MY DOCUMENTS</h1>
            <p className="text-gray-400 font-medium">Keep cooking. Your workspace is ready.</p>
          </div>
          <AddDocumentBtn 
            userId={clerkUser.id}
            email={clerkUser.emailAddresses[0].emailAddress}
          />
        </div>

        {roomDocuments.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roomDocuments.map(({ id, metadata, createdAt }: RoomDocument) => (
              <li key={id} className="group relative list-none">
                <Link href={`/documents/${id}`} className="block h-full p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-blue-500/30 transition-all duration-500">
                  <div className="flex items-start justify-between mb-8">
                    <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                      <FileText size={24} />
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/20 bg-white/5 px-2.5 py-1 rounded-full group-hover:text-blue-400 transition-colors">
                      DOC
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold truncate group-hover:text-blue-400 transition-colors">{metadata.title}</h3>
                    <p className="text-sm font-medium text-gray-500">
                      Edited {dateConverter(createdAt)}
                    </p>
                  </div>

                  <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/5">
                     <div className="flex -space-x-2">
                        {/* Fake avatars for visual flair in dashboard cards */}
                        <div className="size-6 rounded-full bg-blue-500/20 border border-white/10" />
                        <div className="size-6 rounded-full bg-purple-500/20 border border-white/10" />
                     </div>
                     <div className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-all">
                        <DeleteModal roomId={id} />
                     </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ): (
          <div className="flex flex-col items-center justify-center py-32 rounded-[3rem] border border-dashed border-white/10 bg-white/[0.01]">
            <div className="size-20 mb-6 rounded-3xl bg-white/[0.02] flex items-center justify-center text-gray-600">
              <FileText size={40} />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-gray-400">No documents yet.</h3>
            <p className="text-gray-500 mb-8 max-w-xs text-center font-medium italic">Stop idling and start creating some absolute cinema.</p>
            <AddDocumentBtn 
              userId={clerkUser.id}
              email={clerkUser.emailAddresses[0].emailAddress}
            />
          </div>
        )}
      </div>
    </main>
  )
}
  
export default Dashboard
