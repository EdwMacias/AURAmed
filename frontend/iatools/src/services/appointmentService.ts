export async function activateSession(timeoutMs = 2000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'GET',
      signal: controller.signal,
    });
    return response;
  } catch (error) {
    const body = JSON.stringify({ title: 'Error', message: error? error : 'Sin respuesta del servidor.' });

    return new Response(body, {
      status: 200,
      statusText: 'Not Found',
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    clearTimeout(timeoutId);
  }
}