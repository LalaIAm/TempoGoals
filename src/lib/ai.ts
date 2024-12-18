import OpenAI from "openai";
import config, { validateConfig } from "./config";

let openai: OpenAI;

try {
  validateConfig();
  openai = new OpenAI({
    apiKey: config.openai.apiKey,
    dangerouslyAllowBrowser: true,
  });
} catch (error) {
  console.error("OpenAI configuration error:", error);
  throw error;
}

interface GoalSuggestion {
  text: string;
  category: "personal" | "work" | "health";
  confidence: number;
  milestones: Array<{
    title: string;
    dueDate: string;
  }>;
}

export async function generateChatResponse(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
) {
  if (!config.openai.apiKey) {
    throw new Error("OpenAI API key is not configured");
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an AI Goal Coach helping users set and achieve their goals. Be concise and practical.",
        },
        ...messages,
      ],
      model: "gpt-3.5-turbo",
    });

    return completion.choices[0].message.content;
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    if (error.code === "invalid_api_key") {
      throw new Error("Invalid OpenAI API key");
    }
    throw new Error("Failed to generate response");
  }
}

export async function generateGoalSuggestion(
  userInput: string,
): Promise<GoalSuggestion> {
  if (!config.openai.apiKey) {
    throw new Error("OpenAI API key is not configured");
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an AI Goal Coach. Generate a structured goal suggestion based on user input. Respond in JSON format with text, category (personal/work/health), confidence (0-1), and milestones (array of {title, dueDate})",
        },
        { role: "user", content: userInput },
      ],
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" },
    });

    const response = JSON.parse(completion.choices[0].message.content || "{}");
    return response as GoalSuggestion;
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    if (error.code === "invalid_api_key") {
      throw new Error("Invalid OpenAI API key");
    }
    throw new Error("Failed to generate goal suggestion");
  }
}
