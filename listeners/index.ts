import { Server, Socket } from 'socket.io';
import { logger } from '../utils/logger';
import { createMessage } from '../services/chat';

// Define the type for userSockets
type UserSockets = {
    [userId: string]: string;
};

export default function initializeSocketListener(io: Server) {
    // Object to track connected users
    const userSockets: UserSockets = {};

    io.on('connection', (socket: Socket) => {
        logger.info('Socket connection successful');

        // Handle user joining a room
        socket.on('joinRoom', (userId: string) => {
            userSockets[userId] = socket.id;
            socket.join(userId);
            logger.info(`User ${userId} joined room`);
        });

        // Handle user joining a group
        socket.on('joinGroup', (groupId: string) => {
            socket.join(groupId);
            logger.info(`Socket joined group ${groupId}`);
        });

        // Handle receiving a chat message
        socket.on('chatMessage', async (message) => {
            const { senderId, receiverId, content, isGroup } = message;

            try {
                // Save the message to the database
                const savedMessage = await createMessage(
                    senderId,
                    receiverId,
                    content
                    // isGroup
                );

                if (isGroup) {
                    // Emit the message to the group
                    io.to(receiverId).emit('chatMessage', savedMessage);
                } else {
                    // Check if receiver is connected and send the message
                    if (userSockets[receiverId]) {
                        io.to(userSockets[receiverId]).emit(
                            'chatMessage',
                            savedMessage
                        );
                    } else {
                        logger.info(`User ${receiverId} is not connected`);
                    }
                }
            } catch (error) {
                console.error('Error handling chatMessage event:', error);
                socket.emit('error', 'Failed to send message');
            }
        });

        // Handle user disconnecting
        socket.on('disconnect', () => {
            // Find the user ID associated with the disconnected socket
            const disconnectedUserId = Object.keys(userSockets).find(
                (userId) => userSockets[userId] === socket.id
            );

            if (disconnectedUserId) {
                delete userSockets[disconnectedUserId];
                logger.info(`User ${disconnectedUserId} disconnected`);
            } else {
                logger.info('Socket disconnected');
            }
        });
    });
}
