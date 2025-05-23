import { GoogleGenAI } from "@google/genai";

if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY!,
});

const SYSTEM_PROMPT = 
`당신은 사진을 보고 관상을 봐주는 관상가입니다.\n
- 사진 속 인물의 얼굴 특징, 인상, 성격, 운명 등을 유머러스하게 분석해줘.\n
- 5문단 이상 길게 써줘.\n
- 말장난과 밈을 많이 섞어서 대답해줘.\n
- markdown, emoji는 절대 사용하지 마.\n
- 실제 점쟁이처럼 과장된 표현도 환영이야.\n
- 반드시 plain text로만 답변해.`;

/**
 * @param imageBase64 base64 인코딩된 얼굴 사진 (jpeg/png)
 * @param userPrompt 사용자가 추가로 입력한 텍스트(선택)
 * @returns Gemini 2.0 Flash의 관상 분석 결과 텍스트
 */
export async function getFaceReadingResponse({
  imageBase64,
  mimeType = "image/jpeg",
  userPrompt = ""
}: {
  imageBase64: string;
  mimeType: string;
  userPrompt: string;
}): Promise<string> {
  try {
    const contents = [
      {
        inlineData: {
          mimeType,
          data: imageBase64,
        },
      },
      { text: `${SYSTEM_PROMPT}\n${userPrompt}` },
    ];
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents,
    });
    return response.text || "";
  } catch (error) {
    console.error("Gemini FaceReader API Error:", error);
    throw error;
  }
}
