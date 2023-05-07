const fs = require('fs');
const crypto = require('crypto');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

// 讀取 Server 的公鑰和私鑰
const serverPublicKey = fs.readFileSync('ServerPublicKey.txt', 'utf8');
const serverPrivateKey = fs.readFileSync('ServerPrivateKey.txt', 'utf8');

// 使用 Server 的私鑰生成金鑰對
const serverKeyPair = ec.keyFromPrivate(serverPrivateKey);

// 將公鑰傳送給客戶端
const serverPublicKeyHex = serverKeyPair.getPublic('hex');

// 客戶端接收到公鑰後，使用該公鑰生成自己的金鑰對
const clientKeyPair = ec.genKeyPair();
const clientPublicKey = clientKeyPair.getPublic('hex');

// 客戶端使用 Server 的公鑰計算共享密鑰
const serverKey = ec.keyFromPublic(serverPublicKey, 'hex');
const clientSharedSecret = clientKeyPair.derive(serverKey.getPublic());

// 由於雙方計算出來的共享密鑰相同，因此可以將其用作對稱加密的密鑰
const encryptionKey = crypto.createHash('sha256').update(clientSharedSecret.toString()).digest();

// 對資料進行加密
const plaintext = 'Hello, World!';
const iv = crypto.randomBytes(16);
const cipher = crypto.createCipheriv('aes-256-gcm', encryptionKey, iv);
let encryptedData = cipher.update(plaintext, 'utf8', 'hex');
encryptedData += cipher.final('hex');
const tag = cipher.getAuthTag();

// Server接收到加密資料後，使用共享密鑰解密
const decipher = crypto.createDecipheriv('aes-256-gcm', encryptionKey, iv);
decipher.setAuthTag(tag);
let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
decryptedData += decipher.final('utf8');

console.log(decryptedData); // 輸出：Hello, World!
