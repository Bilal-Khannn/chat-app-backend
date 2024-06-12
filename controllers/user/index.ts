import { Request, Response } from 'express';
import { User } from '../../interfaces/user';
import prisma from '../../utils/prisma';
import { logger } from '../../utils/logger';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users: User[] = await prisma.$queryRaw`SELECT * FROM "User"`;

        if (users.length === 0) {
            logger.warn('No users found');
            return res.status(404).json({ message: 'No users found' });
        }

        const formattedUsers = users.map((user) => ({
            id: user.id,
            email: user.email,
            displayName: user.display_name,
            username: user.username,
            profilePicture: user.profile_picture
        }));

        logger.info('Retrieved all users successfully');
        res.status(200).json({
            message: 'Users retrieved successfully',
            data: formattedUsers
        });
    } catch (error) {
        logger.error('Error retrieving users');
        logger.error(error);
        res.status(500).json({
            message: 'Internal server error',
            error: error
        });
    }
};
