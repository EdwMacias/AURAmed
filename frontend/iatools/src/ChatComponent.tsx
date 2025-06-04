// ChatComponent.tsx
import { useState } from "react"
import axios from "axios"

export default function ChatComponent() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<string[]>([])

  const sendMessage = async () => {
    setMessages([...messages, "Tú: " + input])
    const res = await axios.post("http://localhost:8000/consultar-ollama", {
      prompt: input,
    })
    setMessages([...messages, "Tú: " + input, "Bot: " + res.data.answer])
    setInput("")
  }

  return (
    <div>
      <div className="chat-window">
        {messages.map((m, i) => (
          <p key={i}>{m}</p>
        ))}
      </div>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  )
}
