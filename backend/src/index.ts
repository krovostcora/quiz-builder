import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import {connectDb} from './config/database';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(cors({origin: process.env.CLIENT_URL}));
app.use(express.json());

app.get('/health', (_req, res) => {
    res.json({status: 'ok'});
});

async function start(): Promise<void> {
    await connectDb();
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
}

start().catch((error) => {
    console.error('Failed to start server', error);
    process.exit(1);
});