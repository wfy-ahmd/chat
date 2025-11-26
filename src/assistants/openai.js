import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export class Assistant {
  #model;

  constructor(model = "gpt-4o-mini") {
    this.#model = model;
  }

  async chat(history) { 
    try {
      const result = await openai.chat.completions.create({
        model: this.#model,
        messages: history, 
      });
      return result.choices[0]?.message?.content || "";
    } catch (error) {
      console.error("Assistant Error:", error);
      throw error;
    }
  }
}