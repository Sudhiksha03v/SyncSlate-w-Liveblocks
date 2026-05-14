'use server';

import { clerkClient } from "@clerk/nextjs/server";
import { getUserColor, parseStringify } from "../utils";
import { liveblocks } from "../liveblocks";

// Export the ClerkUser interface so it can be imported in other files
export interface ClerkUser {
  id: string;
  firstName: string;
  lastName: string;
  emailAddresses: { emailAddress: string }[];
  imageUrl: string;
}

interface GetUserListResponse {
  data: ClerkUser[];
}

export const getClerkUsers = async ({ userIds }: { userIds: string[] }) => {
  try {
    const client = await clerkClient();
    const response = (await client.users.getUserList({
      emailAddress: userIds,
    })) as GetUserListResponse; // Explicitly typing the response

    const users = response.data.map((user: ClerkUser) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.emailAddresses[0]?.emailAddress || "", // Ensure safety with optional chaining
      avatar: user.imageUrl,
      color: getUserColor(user.id),
    }));

    const sortedUsers = userIds.map((email) =>
      users.find((user) => user.email === email)
    ).filter(Boolean);

    return parseStringify(sortedUsers);
  } catch (error) {
    console.log(`Error fetching users: ${error}`);
  }
};

export const getDocumentUsers = async ({
  roomId,
  currentUser,
  text,
}: {
  roomId: string;
  currentUser: string;
  text: string;
}) => {
  try {
    const room = await liveblocks.getRoom(roomId);

    const users = Object.keys(room.usersAccesses).filter(
      (email) => email !== currentUser
    );

    if (text.length) {
      const lowerCaseText = text.toLowerCase();

      const filteredUsers = users.filter((email: string) =>
        email.toLowerCase().includes(lowerCaseText)
      );

      return parseStringify(filteredUsers);
    }

    return parseStringify(users);
  } catch (error) {
    console.log(`Error fetching document users: ${error}`);
  }
};
