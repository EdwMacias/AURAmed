export interface ChatRequest {
  prompt: string;
  model: string;
  stream: boolean;
}

export interface ChatResponse {
  response?: string;
  respuesta?: {
    response?: string;
  };
}

export async function sendPromptToModel(prompt: string): Promise<string> {
  const res = await fetch("http://localhost:8000/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      model: "deepseek-r1:latest",
      stream: false,
    }),
  });

  console.log({res});

  if (!res.ok) {
    throw new Error("Error al conectar con el modelo IA");
  }

  const data: ChatResponse = await res.json();
  console.log({data});
  const text = data.response ?? data.respuesta?.response;
  
  if (!text) throw new Error("La respuesta del modelo está vacía o malformada");
  return extractAfterThinkTag(text);
}

function extractAfterThinkTag(input: string): string {
  const tag = "</think>";
  const index = input.indexOf(tag);
  return index !== -1 ? input.slice(index + tag.length).trim() : input;
}
