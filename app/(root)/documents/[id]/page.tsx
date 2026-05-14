import CollaborativeRoom from "@/components/document/CollaborativeRoom"
import { getDocument } from "@/lib/actions/room.actions";
import { getClerkUsers } from "@/lib/actions/user.actions";
import { getUserColor } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";
export const dynamic = 'force-dynamic';

const Document = async ({ params }: { params: { id: string } }) => {
  const resolvedParams = await params; // Await the params

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const { id } = resolvedParams;

  const email = clerkUser.emailAddresses[0].emailAddress;

  const room = await getDocument({
    roomId: id,
    userId: clerkUser.emailAddresses[0].emailAddress,
  });

  if (!room) redirect('/');

  const userIds = Object.keys(room.usersAccesses);
  const users = await getClerkUsers({ userIds });

  const usersData: User[] = userIds.map((id) => {
    const user = users?.find((u) => u?.email === id);
    const userType = (room.usersAccesses[id] as string[])?.includes('room:write')
      ? 'editor' as UserType
      : 'viewer' as UserType;

    return {
      id: user?.id || id,
      name: user?.name || id,
      email: user?.email || id,
      avatar: user?.avatar || '/assets/icons/user.svg',
      color: user?.color || getUserColor(id),
      userType
    };
  });

  const currentUserType = (room.usersAccesses[clerkUser.emailAddresses[0].emailAddress] as string[])?.includes('room:write') ? 'editor' : 'viewer';

  return (
    <main className="flex w-full flex-col items-center">
      <CollaborativeRoom
        roomId={id}
        roomMetadata={{
          creatorId: room.metadata.creatorId as string,
          email: room.metadata.email as string,
          title: room.metadata.title as string
        }}
        users={usersData}
        currentUserType={currentUserType}
      />
    </main>
  );
};

export default Document