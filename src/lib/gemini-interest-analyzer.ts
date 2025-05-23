import { GoogleGenAI } from "@google/genai";

const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!key) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}
// @ts-ignore
const ai = new GoogleGenAI({
  apiKey: key as string,
});

/**
 * 카카오톡 대화에서 이성적 호감 분석
 * @param chatText 카카오톡 대화 원문
 * @returns Gemini 분석 결과 텍스트
 */
export async function getInterestAnalysis(chatText: string, input: string): Promise<string> {
  const systemPrompt = 
`아래는 카카오톡 대화 내용이야. 상대방이 내게 이성적으로 어느 정도 관심이 있는지, 
대화의 맥락과 뉘앙스를 바탕으로 분석해줘. 반드시 아래 형식으로만 답변해:
- 호감도(0~100점): (숫자만)
- 분석 요약: (최대 10줄)
- 상대방의 주요 행동/발언 근거: (최대 10줄)
- 화자가 잘하고 있는 점: (최대 10줄)
- 화자가 개선하면 좋을 점: (최대 10줄)
- 추가 요청사항: ${input} 이 내용도 참고해서 분석해줘 (이 내용 관련 최대 10줄).
- 각 사항들에 대해선 개행을 해서 가독성 좋게 해줘
[카카오톡 대화]
${chatText}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: systemPrompt,
    });
    return response.text || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
