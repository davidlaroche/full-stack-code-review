import crypto from "crypto";

const config = {
  secret_key: "sk_key",
  secret_iv: "sk_iv",
  encryption_method: "aes-256-cbc",
};

// TODO? Generate secret hash with crypto to use for encryption
const key = crypto
  .createHash("sha512")
  .update(config.secret_key)
  .digest("hex")
  .substring(0, 32);
const encryptionIV = crypto
  .createHash("sha512")
  .update(config.secret_iv)
  .digest("hex")
  .substring(0, 16);

// Encrypt data
export function encryptData(data) {
  const cipher = crypto.createCipheriv(
    config.encryption_method,
    key,
    encryptionIV
  );
  return Buffer.from(
    cipher.update(data, "utf8", "hex") + cipher.final("hex")
  ).toString("base64");
}

// Decrypt data
export function decryptData(encryptedData) {
  const buff = Buffer.from(encryptedData, "base64");
  const decipher = crypto.createDecipheriv(
    config.encryption_method,
    key,
    encryptionIV
  );
  return (
    decipher.update(buff.toString("utf8"), "hex", "utf8") +
    decipher.final("utf8")
  );
}
