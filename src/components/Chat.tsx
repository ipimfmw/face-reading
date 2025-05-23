"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/useChatStore";
import { getChatResponse } from "@/lib/gemini-chat";
import { cn } from "@/lib/utils";

const PARTNER_TYPES = [
  { key: "humorous", label: "유머러스한" },
  { key: "serious", label: "진지한" },
  { key: "kind", label: "다정한" },
  { key: "cool", label: "쿨한" },
  { key: "active", label: "적극적인" },
];

const PARTNER_TYPE_PROMPT: Record<string, string> = {
  humorous: "상대방은 유머러스하고 재치있는 스타일입니다. 농담과 위트가 넘치는 대화를 해주세요.",
  serious: "상대방은 진지하고 신중한 스타일입니다. 깊이 있는 대화와 진중한 답변을 해주세요.",
  kind: "상대방은 다정하고 배려심이 많은 스타일입니다. 따뜻하고 친절한 말투로 대화해주세요.",
  cool: "상대방은 쿨하고 시크한 스타일입니다. 담백하고 솔직한 답변을 해주세요.",
  active: "상대방은 적극적이고 리드하는 스타일입니다. 주도적으로 대화를 이끌어주세요.",
};

const GENDER_LABEL: Record<string, string> = {
  male: "남자",
  female: "여자",
};

export default function Chat() {
  // 사용자 정보 상태
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [partnerType, setPartnerType] = useState<string>("");
  const [started, setStarted] = useState(false);
  const [message, setMessage] = useState("");
  const {
    messages,
    isLoading,
    addMessage,
    setLoading,
    removePendingMessage,
    context,
    setContext,
  } = useChatStore();

  // systemPrompt 동적 생성
  const systemPrompt = started
    ? `당신은 소개팅에서 만난 ${GENDER_LABEL[gender === "male" ? "female" : "male"]}입니다.\n${PARTNER_TYPE_PROMPT[partnerType] || ""}\n- 상대방(유저)이 어색하지 않게 대화를 자연스럽게 이어가주세요.\n- 너무 장황하지 않게, 2~4줄 이내로 답변해주세요.\n- emoji, markdown은 사용하지 마세요.\n- plain text로만 답변하세요.`
    : "";

  // 채팅 시작 전 입력 폼
  if (!started) {
    return (
      <Card className="max-w-md mx-auto mt-8 p-6 flex flex-col gap-6">
        <div>
          <label className="block font-semibold mb-2">내 성별</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={gender === "male"}
                onChange={() => setGender("male")}
                className="accent-primary"
              />
              남자
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={gender === "female"}
                onChange={() => setGender("female")}
                className="accent-primary"
              />
              여자
            </label>
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-2">원하는 상대방 성격</label>
          <select
            value={partnerType}
            onChange={e => setPartnerType(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-primary"
            aria-label="원하는 상대방 성격 선택"
          >
            <option value="">성격을 선택하세요</option>
            {PARTNER_TYPES.map(type => (
              <option key={type.key} value={type.key}>{type.label}</option>
            ))}
          </select>
        </div>
        <Button
          className="w-full mt-2"
          disabled={!gender || !partnerType}
          onClick={() => setStarted(true)}
        >
          채팅 시작
        </Button>
      </Card>
    );
  }

  // 채팅 핸들러
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage("");
    setLoading(true);

    // 사용자 메시지 추가
    addMessage({
      role: "user",
      content: userMessage,
      status: "fullfilled"
    });

    addMessage({
      role: "assistant",
      content: "...",
      status: "pending"
    });

    try {
      // AI 응답 받기 (systemPrompt 포함)
      const response = await getChatResponse({
        context,
        recentMessages: messages,
        userInput: userMessage,
        systemPrompt,
      });

      // 응답에서 'reply:'와 'context:'로 분리
      let reply = "";
      let contextLine = "";
      (response || "").split(/\n|\r\n/).forEach(line => {
        if (line.startsWith("reply:")) reply = line.replace(/^reply:/, "").trim();
        if (line.startsWith("context:")) contextLine = line.replace(/^context:/, "").trim();
      });
      if (contextLine) {
        setContext(contextLine);
      }
      addMessage({
        role: "assistant",
        content: reply || "빈 응답",
        status: "fullfilled"
      });
    } catch (error) {
      console.error("Error:", error);
      // 에러 메시지 추가
      addMessage({
        role: "assistant",
        content: "죄송합니다. 응답을 생성하는 중에 문제가 발생했습니다.",
        status: "error"
      });
    } finally {
      setLoading(false);
      removePendingMessage();
    }
  };

  return (
    <div className="flex z-20 h-full flex-col">
      <Card className="flex-1 mb-4">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex w-full",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "rounded-lg px-4 py-2 max-w-[80%]",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
      <form onSubmit={handleSubmit} className="flex h-20 gap-2">
        <Textarea
          value={message}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
          placeholder="소개팅 대화를 입력하세요"
          onKeyUp={(e)=>{
            if(e.key === "Enter"){
              handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
            }
          }}
          className="flex-1"
        />
        <Button className="h-full" type="submit" disabled={isLoading}>
          {isLoading ? "sending..." : "send"}
        </Button>
      </form>
    </div>
  );
} 