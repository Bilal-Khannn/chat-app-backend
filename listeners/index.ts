import { Server, Socket } from 'socket.io';
import { logger } from '../utils/logger';
import { createMessage } from '../services/chat';

export default function initializeSocketListener(io: Server) {
    io.on('connection', (socket: Socket) => {
        logger.info('Socket connection successful');

        socket.on('chatMessage', async (message) => {
            const { senderId, receiverId, content } = message;

            try {
                const savedMessage = await createMessage(
                    senderId,
                    receiverId,
                    content
                );
                // Emit the saved message to the sender and receiver
                io.to(senderId.toString()).emit('chatMessage', savedMessage);
                io.to(receiverId.toString()).emit('chatMessage', savedMessage);
            } catch (error) {
                console.error('Error handling chatMessage event:', error);
                socket.emit('error', 'Failed to send message');
            }
        });

        // Example of handling disconnect event
        socket.on('disconnect', () => {
            logger.info('Socket disconnected');
        });
    });
}
