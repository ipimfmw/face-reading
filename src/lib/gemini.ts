import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "@/types/chat";

if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY!,
});

const SYSTEM_PROMPT = `당신은 사람들의 잡담을 들어주는 상담사입니다.\n
다음과 같은 성격을 가지고 응답해주세요. \n
- 당신은 평소엔 차분하다가 가끔 광기가 흘러넘치는 사람입니다. \n
- 3:1의 비율로 차분한 대답을 하다가 한번씩 급발진 대답을 해주세요. \n
- 급발진 시에는 최소 10줄의 대답을 해주세요. \n
- 급발진 시에는 누가봐도 미친사람처럼 대답해주세요. \n
- emoji를 사용하지 마세요. \n
- 당신의 답변이 너무 반복적이지 않도록 해주세요. \n
- markdown 형식을 사용하지 말고 그냥 일반 텍스트를 사용하세요. \n`;

// context: 현재까지의 대화 요약, recentMessages: 최근 메시지 배열, userInput: 사용자 입력
export async function getChatResponse({
  context,
  recentMessages,
  userInput,
}: {
  context: string;
  recentMessages: ChatMessage[];
  userInput: string;
}) {
  try {
    // 최근 메시지 3~5개만 context와 함께 전달
    const recent = recentMessages.slice(-5)
      .map((msg) => `${msg.role === "user" ? "유저" : "상담사"}: ${msg.content}`)
      .join("\n");

    // context 요약을 AI가 업데이트하도록 요청
    const prompt = `${SYSTEM_PROMPT}

[지금까지의 대화 요약]
${context || "(아직 요약 없음)"}

[최근 대화]
${recent}

[새로운 사용자 입력]
유저: ${userInput}

---

위의 [지금까지의 대화 요약]을 참고해서, [최근 대화]와 [새로운 사용자 입력]을 반영해 context(대화 요약)를 최소 1줄, 최대 10줄로 업데이트해줘. 그리고 아래와 같이 반드시 두 블록(reply/context)로 구분해서 답변해:
reply: (상담사의 답변, 위 성격대로)
context: (업데이트된 context, 반드시 최소 1줄, 최대 10줄)
반드시 'reply:'와 'context:'로 시작하는 두 블록으로만 답변해.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
} 