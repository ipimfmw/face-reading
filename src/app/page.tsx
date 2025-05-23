"use client"

import Chat from "@/components/Chat";
import FaceReader from "@/components/FaceReader";
import { useState } from "react";
import YoutubeSummarize from "./components/YoutubeSummarize";
import InterestAnalyzer from "./components/InterestAnalyzer";

const TABS = [
  { key: "chat", label: "소개팅 연습" },
  { key: "face", label: "관상보기" },
  { key: "summarize", label: "유튜브 요약" },
  { key: "interest", label: "그는 내게 관심이 있을까?" },
];

export default function Home() {
  const [tab, setTab] = useState<"chat" | "face" | "summarize" | "interest">("chat");

  return (
    <main className="container flex flex-col mx-auto py-2 px-4 h-screen">
      {/* 네비게이터 */}
      <nav className="flex gap-2 justify-center items-center mt-2 mb-4" role="tablist">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            tabIndex={0}
            className={`px-4 py-2 rounded-t-lg font-bold text-lg focus:outline-none transition-colors
              ${tab === key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-primary/10"}`}
            onClick={() => setTab(key as "chat" | "face")}
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === " ") setTab(key as "chat" | "face");
            }}
          >
            {label}
          </button>
        ))}
      </nav>
      <div className="flex-1 relative">
        {tab === "chat" && <Chat />}
        {tab === "face" && <FaceReader />}
        {tab === "summarize" && <YoutubeSummarize />}
        {tab === "interest" && <InterestAnalyzer />}
      </div>
    </main>
  );
}
