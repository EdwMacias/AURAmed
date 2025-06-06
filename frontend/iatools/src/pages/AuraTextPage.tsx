"use client";

import { Link } from "react-router-dom";
import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Send, ArrowLeft } from "lucide-react";
import { sendPromptToModel } from "../services/chatService";
import ReactMarkdown from "react-markdown";

export default function AuraTextPage() {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<
    { sender: string; text: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { sender: "client", text: message };
    setConversation((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const aiResponse = await sendPromptToModel(message);
      const botMessage = { sender: "Auramed", text: aiResponse };
      setConversation((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setConversation((prev) => [
        ...prev,
        { sender: "Auramed", text: "Ocurrió un error al contactar con AURAmed." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen">
      {/* Header */}
      <header className="flex items-center justify-center text-xl font-bold border-b p-4 relative gray-color">
        <Link to="/AppointmentOptions">
          <Button
            size="icon"
            variant="outline"
            className="rounded-full absolute left-4 top-1/2 transform -translate-y-1/2 "
          >
            <ArrowLeft className="h-4 w-4 primary-color" />
          </Button>
        </Link>
        AURAmed
      </header>

      {/* Chat */}
      <main className="flex-grow overflow-y-auto p-4 space-y-4">
        {conversation.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "client" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 rounded-2xl max-w-[70%] text-sm leading-relaxed text-left ${
                msg.sender === "client"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
              style={{ whiteSpace: "pre-wrap" }}
            >
               <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 p-3 rounded-2xl max-w-[70%] text-sm">
              AURAmed está escribiendo...
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="p-4  relative p-footer">
        <div className="flex items-center ">
          <Input
            placeholder="Escribe tu mensaje..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            className="flex-grow pr-12 border-gray rounded-full input"
            disabled={loading}
          />
          <Button
            size="icon"
            className="rounded-full absolute bottom-4 right-28"
            onClick={handleSendMessage}
            disabled={loading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </footer>
    </div>
  );
}
