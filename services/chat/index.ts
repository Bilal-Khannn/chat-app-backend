import prisma from '../../utils/prisma';
import { User } from '../../interfaces/user';
import { Chat, Message } from '../../interfaces/chat';

export const createMessage = async (
    senderId: number,
    receiverId: number,
    content: string,
    isGroup?: boolean
) => {
    try {
        // Validate sender and receiver
        const sender: User[] =
            await prisma.$queryRaw`SELECT * FROM "User" WHERE id = ${senderId}`;
        const receiver: User[] =
            await prisma.$queryRaw`SELECT * FROM "User" WHERE id = ${receiverId}`;

        if (sender.length === 0 || receiver.length === 0) {
            throw new Error('Sender or receiver not found');
        }

        // Check if a one-to-one chat already exists between the users
        const chat: Chat[] = await prisma.$queryRaw`
        SELECT "Chat".*
        FROM "Chat"
        JOIN "_ChatMembers" ON "Chat".id = "_ChatMembers"."A"
        WHERE "Chat".type = 'ONE_TO_ONE'
        AND "_ChatMembers"."B" IN (${senderId}, ${receiverId})
        GROUP BY "Chat".id
        HAVING COUNT("Chat".id) = 2
      `;

        let chatId;
        if (chat.length === 0) {
            // No chat exists, create a new one
            const newChat: Chat[] = await prisma.$queryRaw`
          INSERT INTO "Chat" (type)
          VALUES ('ONE_TO_ONE')
          RETURNING id
        `;
            chatId = newChat[0].id;

            // Link the users to the new chat
            await prisma.$executeRaw`
          INSERT INTO "_ChatMembers" ("A", "B")
          VALUES (${chatId}, ${senderId}), (${chatId}, ${receiverId})
        `;
        } else {
            chatId = chat[0].id;
        }

        const message: Message[] = await prisma.$queryRaw`
    INSERT INTO "Message" (content, "senderId", "chatId", "timestamp")
    VALUES (${content}, ${senderId}, ${chatId}, NOW())
    RETURNING "Message".*, (SELECT "User"."display_name" FROM "User" WHERE "User"."id" = ${senderId}) AS "sender_name"
  `;

        return message[0];
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};
