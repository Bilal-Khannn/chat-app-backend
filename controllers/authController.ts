import { Request, Response } from 'express';
import logger from '../utils/logger';
import prisma from '../utils/prisma';
import { User } from '../types/types';
import bcrypt from 'bcrypt';

export const signup = async (req: Request, res: Response) => {
    const { email, displayName, username, password } = req.body;

    if (!email || !displayName || !username || !password) {
        logger.warn('Missing required fields for user registration');
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const existingUser: User[] =
            await prisma.$queryRaw`SELECT * FROM "User" WHERE email = ${email} OR username = ${username}`;

        if (existingUser.length > 0) {
            logger.warn('Email or username already exists');
            return res
                .status(409)
                .json({ message: 'Email or username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser: User = await prisma.$queryRaw<User>`
        INSERT INTO "User" (email, "display_name", username, password) 
        VALUES (${email}, ${displayName}, ${username}, ${hashedPassword})
        RETURNING id, email, "display_name", username, password, "profile_picture"
    `;
        logger.info(`User registered successfully: ${newUser}`);
        res.status(200).json({
            message: 'User registration successful',
            data: newUser
        });
    } catch (error) {
        logger.error('Error registering user');
        logger.error(error);
        res.status(500).json({
            message: 'Interval server error',
            error: error
        });
    }
};
