export interface ChatRequest {
  prompt: string;
  model: string;
  stream: boolean;
}

export interface ChatResponse {
  mensaje?: string;
  respuesta?: string | { mensaje?: string };
}

export async function sendPromptToModel(prompt: string): Promise<string> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/generate`, {
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

  if (!res.ok) {
    throw new Error("Error al conectar con el modelo IA");
  }

  const data: ChatResponse = await res.json();
  const text =
    typeof data.respuesta === "string"
      ? data.respuesta
      : typeof data.respuesta === "object" && data.respuesta?.mensaje
      ? data.respuesta.mensaje
      : data.mensaje;

  if (!text) {
    throw new Error("La respuesta del modelo está vacía o malformada");
  }
  return extractAfterThinkTag(text);
}

function extractAfterThinkTag(input: string): string {
  const tag = "</think>";
  const index = input.indexOf(tag);
  return index !== -1 ? input.slice(index + tag.length).trim() : input;
}
