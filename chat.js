import readline from "node:readline/promises";
import { vectorStore } from "./prep_data.js";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});
export async function chat() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  while (true) {
    const ques = await rl.question("You: ");
    if (ques === "/bye") {
      break;
    }
    // console.log(ques);

    //    retreivel phase
    const relevantChunks = await vectorStore.similaritySearch(ques, 3);
    const context = relevantChunks
      .map((chunk) => chunk.pageContent)
      .join("\n\n");
    // console.log(context);

    const SYSTEM_PROMPT = `You are an expert assistant for question-answering tasks.`;

    const userPrompt = `
  Context: ${context}
  
  ---
  
  Question: ${ques}
  
  ---
  
  Instructions: Use ONLY the provided context to answer the question. 
  If the answer or relevant information is not present in the context, do not answer; 
  instead, you MUST respond with the exact phrase: "i dont know".
`;

    const completion = await ai.models.generateContent({
      model: "gemini-2.5-flash",

      contents: [
        {
          role: "user",
          parts: [{ text: userPrompt }],
        },
      ],

      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.0,
      },
    });

    console.log(completion.text);
  }

  rl.close();
}
chat();
