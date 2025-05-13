"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/useChatStore";
import { getChatResponse } from "@/lib/gemini";
import { cn } from "@/lib/utils";

export default function Chat() {
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
  const generateMessage = async (userMessage: string) => {
    try {
        // AI 응답 받기 (context, 최근 메시지, userInput 전달)
        const response = await getChatResponse({
          context,
          recentMessages: messages,
          userInput: userMessage,
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
        if(!reply) {
           generateMessage(userMessage);
           return;
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
  }
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
    })

    generateMessage(userMessage);
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
          placeholder="type your message here"
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