import OpenAI from "openai";
import 'dotenv/config';

const apiKey = process.env.OPENAI_API_KEY;
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const response = await client.responses.create({
    model: "gpt-4.1-nano",
    input: "Give me ideas for today's schedule"
});

console.log(response.output_text);
