"use client";

import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Send, ArrowLeft, Mic, StopCircle } from "lucide-react";
import { sendPromptToModel } from "../services/chatService";
import ReactMarkdown from "react-markdown";

type Message = {
  sender: "client" | "Auramed";
  type: "text" | "audio";
  content: string;
};

export default function AuraChatPage() {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      sender: "client",
      type: "text",
      content: message,
    };
    setConversation((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const aiResponse = await sendPromptToModel(message);
      const botMessage: Message = {
        sender: "Auramed",
        type: "text",
        content: aiResponse,
      };
      setConversation((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setConversation((prev) => [
        ...prev,
        {
          sender: "Auramed",
          type: "text",
          content: "Ocurrió un error al contactar con AURAmed.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const audioURL = URL.createObjectURL(audioBlob);
        setConversation((prev) => [
          ...prev,
          { sender: "client", type: "audio", content: audioURL },
        ]);

        // Simulación de respuesta
        setTimeout(() => {
          setConversation((prev) => [
            ...prev,
            {
              sender: "Auramed",
              type: "text",
              content: "Gracias por tu mensaje de voz.",
            },
          ]);
        }, 1000);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Error al acceder al micrófono:", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div className="flex flex-col h-screen w-screen">
      {/* Header */}
      <header className="flex items-center justify-center text-xl font-bold border-b p-4 relative bg-white gray-color">
        <Link to="/AppointmentOptions">
          <Button
            size="icon"
            variant="outline"
            className="rounded-full absolute left-4 top-1/2 transform -translate-y-1/2"
          >
            <ArrowLeft className="h-4 w-4 primary-color" />
          </Button>
        </Link>
        AURAmed
      </header>

      {/* Chat */}
      <main className="relative flex-grow overflow-y-auto p-4 space-y-4 bg-[#50bfff60]">
        {/* Fondo con imagen y opacidad */}
        <div className="pointer-events-none absolute inset-0 bg-[url('https://img.freepik.com/free-vector/green-medical-patterned-background-vector_53876-169038.jpg')] bg-repeat opacity-20 z-0"></div>

        {/* Contenido del chat */}
        <div className="relative z-10 space-y-4">
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
                    ? msg.type === "text"
                      ? "bg-blue-500 text-white"
                      : "bg-background text-gray-100"
                    : "bg-gray-200 text-gray-800"
                }`}
                style={{ whiteSpace: "pre-wrap" }}
              >
                {msg.type === "text" ? (
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                ) : (
                  <audio controls src={msg.content} />
                )}
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
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 relative border-t bg-white p-footer">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Escribe tu mensaje..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            className="flex-grow rounded-full input border-gray pr-12 "
            disabled={loading}
          />

          <Button
            size="icon"
            className="rounded-full"
            onClick={handleSendMessage}
            disabled={loading}
          >
            <Send className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            className="rounded-full"
            onClick={recording ? stopRecording : startRecording}
            variant={recording ? "destructive" : "default"}
          >
            {recording ? (
              <StopCircle className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </Button>
        </div>
      </footer>
    </div>
  );
}
