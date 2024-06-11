import { Request, Response } from 'express';
import logger from '../../utils/logger';
import prisma from '../../utils/prisma';
import { User } from '../../interfaces/user';
import bcrypt from 'bcrypt';
import { generateToken } from '../../utils/jwt';

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

export const signin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        logger.warn('Missing required fields for user login');
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const user: User[] =
            await prisma.$queryRaw`SELECT * FROM "User" WHERE email = ${email}`;

        if (user.length === 0) {
            logger.warn('User not found');
            return res
                .status(404)
                .json({ message: 'Invalid email or password' });
        }

        const validPassword = await bcrypt.compare(password, user[0].password);

        if (!validPassword) {
            logger.warn('Invalid password');
            return res
                .status(401)
                .json({ message: 'Invalid email or password' });
        }

        const token = generateToken({ id: user[0].id });

        res.cookie('token', token, {
            // httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set secure flag in production
            maxAge: 3600000 // 1 hour
        });

        logger.info(`User logged in successfully: ${user[0].email}`);
        res.status(200).json({
            message: 'Login successful',
            data: {
                id: user[0].id,
                email: user[0].email,
                displayName: user[0].display_name,
                username: user[0].username,
                profilePicture: user[0].profile_picture
            }
        });
    } catch (error) {
        logger.error('Error logging in user');
        logger.error(error);
        res.status(500).json({
            message: 'Internal server error',
            error: error
        });
    }
};

export const editProfile = (req: Request, res: Response) => {
    console.log('hit the test route');
    res.json({ message: 'Found the cookie' });
};
