'use client';

import Loader from '@/components/shared/Loader';
import { getDocumentUsers, getClerkUsers } from '@/lib/actions/user.actions';
import { useUser } from '@clerk/nextjs';
import { ClientSideSuspense, LiveblocksProvider } from '@liveblocks/react/suspense';
import { ReactNode } from 'react';

interface LiveblocksUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  color: string;
}

// Removed the unused getClerkUsers function and DocumentUser interface

const Provider = ({ children }: { children: ReactNode }) => {
  const { user: clerkUser } = useUser();

  return (
    <LiveblocksProvider
      authEndpoint="/api/liveblocks-auth"
      resolveUsers={async ({ userIds }): Promise<LiveblocksUser[]> => {
        // Assuming getClerkUsers is properly used or handled here
        const clerkUsers = await getClerkUsers({ userIds });

        return (clerkUsers || [])
          .filter((user): user is User => Boolean(user))
          .map((user) => ({
            id: user.id,
            name: user.name || 'Unknown',
            email: user.email || 'No Email',
            avatar: user.avatar || '',
            color: '#000000',
          }));
      }}
      resolveMentionSuggestions={async ({ text, roomId }): Promise<string[]> => {
        const emailAddress = clerkUser?.emailAddresses?.[0]?.emailAddress;

        if (!emailAddress) {
          throw new Error('User email address is unavailable.');
        }

        const documentUsers: string[] = (await getDocumentUsers({
          roomId,
          currentUser: emailAddress,
          text,
        })) || [];

        return documentUsers;
      }}
    >
      <ClientSideSuspense fallback={<Loader />}>
        {children}
      </ClientSideSuspense>
    </LiveblocksProvider>
  );
};

export default Provider;
