import { GoogleGenAI, Type } from "@google/genai";
import { FreeRequestJudgment, Product } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const judgeFreeRequest = async (product: Product, userReason: string): Promise<FreeRequestJudgment> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Product: "${product.name}" (€${product.price})\nCustomer Reason: "${userReason}"`,
      config: {
        systemInstruction: `You are the AI Shopkeeper of PolyForge, a futuristic 3D printing store. 
        A customer wants a product for FREE. You must judge their reason.
        - If the reason is lazy, boring, or entitled, REJECT it.
        - If the reason is creative, funny, poetic, or genuinely touching, APPROVE it.
        - Provide a witty, slightly sarcastic, or cyber-themed comment explaining your decision.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            approved: { type: Type.BOOLEAN },
            reason: { type: Type.STRING, description: "A brief explanation of your verdict." },
            wittyComment: { type: Type.STRING, description: "A funny or sarcastic remark to the customer." }
          },
          required: ["approved", "reason", "wittyComment"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as FreeRequestJudgment;
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      approved: false,
      reason: "AI Neural Link Offline",
      wittyComment: "My logic circuits are currently rebooting. Cash only until I'm back online."
    };
  }
};

export const generateReceiptMessage = async (product: Product, customerName: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Customer: ${customerName}\nProduct: ${product.name}`,
      config: {
        systemInstruction: "Write a short, cool, cyberpunk-style receipt footer message. Max 2 sentences. Be friendly but futuristic.",
      }
    });
    return response.text || "Thank you for your patronage.";
  } catch (e) {
    return "Thank you for your purchase. System nominal.";
  }
};