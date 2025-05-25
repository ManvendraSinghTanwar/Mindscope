import { NextResponse } from "next/server";
import Together from "together-ai";

export async function POST(req: Request) {
  const { prompt, mode } = await req.json();

  const apiKey = process.env.TOGETHER_API_KEY1;
  const together = new Together({ apiKey });

  let llamaPrompt = "";

  if (mode === "journal") {
    llamaPrompt = `
You are a journaling assistant. Respond ONLY with a valid JSON object. DO NOT include explanations, introductions, or comments.

Example output:
{
  "mood": "Positive",
  "emotions": ["happy", "grateful"],
  "sentiment": 0.87,
  "keyThemes": ["work", "stress", "relationships"],
  "suggestions": ["Try meditating", "Talk to a friend", "Focus on what's in your control"]
}

Now analyze this journal entry and return only the JSON object:

Journal Entry:
${prompt}
`;
  } else if (mode === "chat") {
    llamaPrompt = `
You are a compassionate mental health AI companion. Respond with supportive, empathetic responses. Offer emotional validation, encouragement, and helpful suggestions when appropriate.

User:
${prompt}
`;
  } else {
    return NextResponse.json({ error: "Invalid mode specified" }, { status: 400 });
  }

  try {
    const response = await together.chat.completions.create({
      messages: [{ role: "user", content: llamaPrompt }],
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    });

    const rawContent = response.choices?.[0]?.message?.content ?? "No content returned";
    console.log("🔍 LLaMA raw output:", rawContent);

    // If journal mode, extract and parse JSON
    if (mode === "journal") {
      const startIndex = rawContent.indexOf("{");
      const endIndex = rawContent.lastIndexOf("}");
      if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
        let jsonString = rawContent.slice(startIndex, endIndex + 1);
        jsonString = jsonString
          .replace(/,(\s*[}\]])/g, "$1") // remove trailing commas
          .replace(/([\{|,])\s*([a-zA-Z0-9_]+)\s*:/g, '$1 "$2":') // ensure quoted keys
          .replace(/'/g, '"'); // convert single quotes to double

        try {
          const jsonResult = JSON.parse(jsonString);
          return NextResponse.json(jsonResult);
        } catch (e) {
          return NextResponse.json({
            error: "LLaMA response could not be parsed as JSON",
            raw: rawContent,
          });
        }
      } else {
        return NextResponse.json({
          error: "No JSON object found in LLaMA response",
          raw: rawContent,
        });
      }
    }

    // For chat mode, return as plain string
    return NextResponse.json({ result: rawContent });
  } catch (err) {
    return NextResponse.json({
      error: "LLaMA API error",
      details:
        typeof err === "object" && err !== null && "message" in err
          ? (err as any).message
          : String(err),
    });
  }
}
