import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import prisma from './utils/prisma';
import { logger } from './utils/logger';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import chatRoutes from './routes/chat';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import initializeSocketListener from './listeners';

dotenv.config();

const app: Express = express();
const httpServer = createServer(app);
const port = process.env.PORT || 3000;

// Initialize Socket.IO server
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000',
        credentials: true
    }
});

initializeSocketListener(io);

app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true
    })
);

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/chat', chatRoutes);

// Error handler middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error('Internal server error');
    logger.error(err.stack);
    res.status(500).send('Internal server error');
});

prisma
    .$connect()
    .then(async () => {
        logger.info('[database]: Connection to the database successful');
    })
    .catch((error) => {
        logger.error('[database]: Unable to connect to the database');
        logger.error(error);
        process.exit(1); // Exit the process if unable to connect
    });

httpServer.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
