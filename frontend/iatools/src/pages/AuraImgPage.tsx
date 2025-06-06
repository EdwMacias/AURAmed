import { useState, useRef } from 'react';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Mic, StopCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Message {
  type: 'audio' | 'text';
  content: string;
}

export default function AuraImgPage() {
  const [recording, setRecording] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioURL = URL.createObjectURL(audioBlob);

        setConversation((prev) => [...prev, { type: 'audio', content: audioURL }]);

        setTimeout(() => {
          const response = 'Gracias por tu mensaje de voz.';
          setConversation((prev) => [...prev, { type: 'text', content: response }]);
        //   speechSynthesis.speak(new SpeechSynthesisUtterance(response));
        }, 1000);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error('Error al acceder al micrófono:', err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div className="flex flex-col h-screen w-screen">
      <header className="flex-shrink-0 flex items-center justify-center text-xl font-bold border-b p-4 relative">
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

      <main className="flex-grow overflow-y-auto p-4 space-y-4">
        {conversation.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.type === 'audio' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`p-3 rounded-lg max-w-[70%] ${
                msg.type === 'audio'
                  ? ' text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {msg.type === 'audio' ? (
                <audio controls src={msg.content} />
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
      </main>

      <footer className="flex items-center px-4 py-3 bg-background fixed bottom-0 left-0 right-0 border-t">
        <div className="flex flex-grow items-center space-x-2">
          <div className="flex-grow border rounded-full py-2 px-4">
            <Label htmlFor="voice-input" className="sr-only">
              Voice Input
            </Label>
            <span>
              {recording ? "Grabando..." : "Presiona el micrófono para hablar"}
            </span>
          </div>
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
            <span className="sr-only">{recording ? "Detener" : "Grabar"}</span>
          </Button>
        </div>
      </footer>
    </div>
  );
}
