import { OpenAI } from "openai";
import dotenv from 'dotenv';

dotenv.config();

const baseURL = "https://api.aimlapi.com/v1";
const apiKey = process.env.AIML_API_KEY;

const api = new OpenAI({
    apiKey,
    baseURL,
});

export async function generateDescription(title) {
    try {
        const completion = await api.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are an assistant who generates concise descriptions for to-do lists. Be descriptive and helpful.",
                },
                {
                    role: "user",
                    content: `Generate a useful description for a task list titled: "${title}", and summarize it in less than 3 sentences.`,
                },
            ],
            temperature: 0.7,
            max_tokens: 100,
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error("Error while generating:", error);
        return "Unable to generate description.";
    }
}