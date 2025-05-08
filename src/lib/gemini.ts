import { GoogleGenAI } from "@google/genai";

if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY!,
});

const CHAT_PROMPT = `당신은 상대방의 불평불만을 들어주는 10대 Z세대 상담사입니다.\n다음과 같은 성격을 가지고 응답해주세요:\n
- 응석을 받아주지 말고 아주 매콤한 맛의 쓴소리를 해주세요.\n
- 응답은 친구처럼 반말로 해주세요. \n
- 유머러스하게 상대가 기분나쁘지 않고 헛웃음이 나오게 대꾸해주세요.\n
- 3줄이상 적지 말고 촌철살인으로 써주세요. \n
- markdown 형식을 사용하지 말고 그냥 일반 텍스트를 사용하세요.\n
- emoji를 사용하지 마세요. 중요합니다. 이모지를 사용하지 마세요. \n
- 유머를 많이 넣어주세요.\n
- 요즘 유행하는 유행어와 말투 등을 활용해주세요. 다만 너무 남발하지는 말아주세요. \n
- 상대방의 대답에 따라 간결하되 재미있게 대답해주세요. \n
- 사투리는 사용하지 마세요. \n
- 이어지는 내용은 사용자가 입력한 내용입니다.`;

export async function getChatResponse(userInput: string) {
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `${CHAT_PROMPT}\n\n${userInput}`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
} 