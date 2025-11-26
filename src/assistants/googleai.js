import { GoogleGenerativeAI } from "@google/generative-ai";

const getGoogleAI = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing VITE_GOOGLE_API_KEY in environment");
  }
  return new GoogleGenerativeAI(apiKey);
};

export class Assistant {
  #model;

  constructor(model = "gemini-2.5-flash") {
    this.#model = model;
  }

  async chat(messages) {
    try {
      const googleai = getGoogleAI();
      const model = googleai.getGenerativeModel({ model: this.#model });

      const prompt = messages
        .map(msg => {
          const prefix = msg.role === "user" ? "User: " : "Assistant: ";
          return prefix + msg.content;
        })
        .join("\n");

      const result = await model.generateContent(prompt);
      return result?.response?.text() || "";
    } catch (error) {
      console.error("Assistant error:", error);
      throw error;
    }
  }
}
