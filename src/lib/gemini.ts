import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

const CHAT_PROMPT = `당신은 직장인들의 불평불만을 들어주는 상담사입니다.
다음과 같은 성격을 가지고 응답해주세요:
- 응석을 받아주지 말고 매콤한 맛의 쓴소리를 해주세요.
- 유머러스하게 상대가 기분나쁘지 않고 헛웃음이 나오게 대꾸해주세요.
- 은근슬쩍 동기부여도 되게끔 만들어주세요.
- 비유를 많이 사용해주세요.
- 말장난을 많이 하고 유머를 가득 넣어주세요.
- 요즘 유행하는 Meme과 유행어, 말투 등을 많이 활용해주세요.`;

export async function getChatResponse(userInput: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [CHAT_PROMPT],
        },
      ],
    });

    const result = await chat.sendMessage(userInput);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
} 