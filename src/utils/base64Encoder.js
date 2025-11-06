export const encodeBase64 = (numStr) => {
  const buffer = Buffer.from(numStr);
  const encoded = buffer.toString("base64").replace(/[^a-zA-Z0-9]/g, "").substring(0, 6);
  return encoded;
};
