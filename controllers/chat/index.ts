import { Request, Response } from 'express';
import prisma from '../../utils/prisma';
import { Message } from '../../interfaces/chat';

export const fetchOneToOneChats = async (req: Request, res: Response) => {
    try {
        const userIdParam: string | undefined = req.query.userId as
            | string
            | undefined;

        if (!userIdParam) {
            return res
                .status(400)
                .json({ message: 'Missing userId parameter' });
        }

        const userId: number = parseInt(userIdParam);

        if (isNaN(userId)) {
            return res
                .status(400)
                .json({ message: 'Invalid userId parameter' });
        }

        const oneToOneChats = await prisma.chat.findMany({
            where: {
                type: 'ONE_TO_ONE',
                members: {
                    some: {
                        id: userId
                    }
                }
            },
            select: {
                id: true,
                members: {
                    select: {
                        id: true,
                        display_name: true
                    }
                }
            }
        });

        if (oneToOneChats.length === 0) {
            return res
                .status(404)
                .json({ message: 'No one-to-one chats found' });
        }

        const formattedChats = oneToOneChats.map((chat) => {
            const [sender, receiver] = chat.members;
            return {
                id: chat.id,
                sender_id: sender.id,
                sender_name: sender.display_name,
                receiver_id: receiver.id,
                receiver_name: receiver.display_name
            };
        });

        res.status(200).json({
            message: 'One-to-one chats retrieved successfully',
            data: formattedChats
        });
    } catch (error) {
        console.error('Error fetching one-to-one chats:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const fetchConversation = async (req: Request, res: Response) => {
    try {
        const chatIdParam: string | undefined = req.query.chatId as
            | string
            | undefined;

        if (!chatIdParam) {
            return res
                .status(400)
                .json({ message: 'Missing chatId parameter' });
        }

        const chatId: number = parseInt(chatIdParam);

        if (isNaN(chatId)) {
            return res
                .status(400)
                .json({ message: 'Invalid chatId parameter' });
        }

        // Fetch all messages for the given chatId
        const messages = await prisma.message.findMany({
            where: {
                chatId: chatId
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        display_name: true
                    }
                }
            }
        });

        // If no messages found, return a 404 status
        if (messages.length === 0) {
            return res
                .status(404)
                .json({ message: 'No messages found for this chat' });
        }

        // Prepare response data with message details
        const formattedMessages = messages.map((message) => ({
            id: message.id,
            content: message.content,
            timestamp: message.timestamp,
            sender_id: message.sender.id,
            sender_name: message.sender.display_name
        }));

        res.status(200).json({
            message: 'Messages retrieved successfully',
            data: formattedMessages
        });
    } catch (error) {
        console.error('Error fetching conversation:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
