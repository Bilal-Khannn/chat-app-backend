import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import prisma from './utils/prisma';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

prisma
    .$connect()
    .then(async () => {
        console.log('[database]: Connection to the database successful');
    })
    .catch((error) => {
        console.error('[database]: Unable to connect to the database');
        console.error(error);
        process.exit(1); // Exit the process if unable to connect
    });

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
