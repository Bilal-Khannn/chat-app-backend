import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import prisma from './utils/prisma';
import logger from './utils/logger';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/auth', authRoutes);

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

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
