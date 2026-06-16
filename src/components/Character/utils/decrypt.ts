async function generateAESKey(password: string): Promise<CryptoKey> {
  const passwordBuffer = new TextEncoder().encode(password);
  const hashedPassword = await crypto.subtle.digest("SHA-256", passwordBuffer);
  return crypto.subtle.importKey(
    "raw",
    hashedPassword.slice(0, 32),
    { name: "AES-CBC" },
    false,
    ["encrypt", "decrypt"]
  );
}

export const decryptFile = async (
  url: string,
  password: string,
  onProgress?: (percent: number) => void
): Promise<ArrayBuffer> => {
  const response = await fetch(url);
  if (!response.body) {
    throw new Error("Response body is not readable");
  }
  const contentLength = response.headers.get("content-length");
  if (!contentLength) {
    const data = await response.arrayBuffer();
    if (onProgress) onProgress(100);
    return data;
  }

  const total = parseInt(contentLength, 10);
  let loaded = 0;

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      chunks.push(value);
      loaded += value.length;
      if (onProgress) {
        onProgress(Math.round((loaded / total) * 100));
      }
    }
  }

  const allChunks = new Uint8Array(loaded);
  let position = 0;
  for (const chunk of chunks) {
    allChunks.set(chunk, position);
    position += chunk.length;
  }

  const iv = new Uint8Array(allChunks.buffer.slice(0, 16));
  const data = allChunks.buffer.slice(16);
  const key = await generateAESKey(password);
  return crypto.subtle.decrypt({ name: "AES-CBC", iv }, key, data);
};
