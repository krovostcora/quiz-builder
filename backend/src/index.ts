import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import {connectDb} from './config/database';
import {quizRouter} from './routes/quizRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(cors({origin: process.env.CLIENT_URL}));
app.use(express.json());
app.use('/quizzes', quizRouter);
app.use(notFoundHandler);
app.use(errorHandler);

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