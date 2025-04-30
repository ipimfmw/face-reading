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
  const { messages, isLoading, addMessage, setLoading } = useChatStore();

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
    });

    try {
      // AI 응답 받기
      const response = await getChatResponse(userMessage);
      
      // AI 메시지 추가
      addMessage({
        role: "assistant",
        content: response,
      });
    } catch (error) {
      console.error("Error:", error);
      // 에러 메시지 추가
      addMessage({
        role: "assistant",
        content: "죄송합니다. 응답을 생성하는 중에 문제가 발생했습니다.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
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
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="불평불만을 마음껏 털어놓으세요..."
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "전송 중..." : "전송"}
        </Button>
      </form>
    </div>
  );
} 