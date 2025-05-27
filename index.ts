import express from 'express';
import {defaultMiddleware} from '@nlbridge/express';
import 'dotenv/config';

const app = express();
const port = 8080;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to NLUX + Node.js demo server!');
});

app.post('/chat-api',
    defaultMiddleware('openai', {
        apiKey: process.env.OPENAI_API_KEY,
        chatModel: 'gpt-4.1-nano',
    }),
);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});