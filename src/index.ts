import express from "express";
import cors from "cors";
import "dotenv/config";
import OpenAI from "openai";

const app = express();
const port = process.env.PORT || 8080;
app.use(cors());
app.use(express.json());

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const systemPrompt = `
  You are a silent, efficient JSON-only schedule generator.
  You will be given a time range (e.g., "8am-10pm") and a list of tasks.
  Your ONLY job is to create a schedule for that exact time range, including the user's tasks and creatively filling any empty gaps with logical activities (like 'Lunch', 'Work Block', 'Break').

  CRITICAL RULES:
  - Your entire output MUST be a single, valid JSON object.
  - Do NOT include any text, greetings, explanations, or markdown formatting.
  - The JSON object must have a "date" (YYYY-MM-DD) and an "events" array.
  - Each event in the array must have an "id", "title", "startTime" (HH:mm), "endTime" (HH:mm), and a "description".
  - Adhere strictly to the provided time range.
`;

app.post("/chat-api", async (req, res) => {
  try {
    const { timeRange, tasks, existingSchedule } = req.body;

    if (!tasks) {
      return res.status(400).send("Missing tasks in the request body.");
    }

    let userPrompt;
    if (existingSchedule) {
      userPrompt = `Refine the following schedule: ${JSON.stringify(
        existingSchedule
      )}. The user's new instruction is: "${tasks}". Generate the complete, updated schedule.`;
    } else {
      userPrompt = `Generate a schedule for the time range "${
        timeRange || "9am-10pm"
      }". The tasks to include are: "${tasks}".`;
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    });

    const aiResponse = completion.choices[0]?.message?.content;
    res.send(aiResponse);
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    res.status(500).send("An error occurred while communicating with the AI.");
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
