import Chat from "@/components/Chat";

export default function Home() {
  return (
    <main className="container mx-auto p-4 min-h-screen">
      <h1 className="text-4xl font-bold text-center my-8">
        직장인 불평불만 상담소
      </h1>
      <Chat />
    </main>
  );
}
