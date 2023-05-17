const crypto = require('crypto');

// 生成ECDH對象
const ecdhA = crypto.createECDH('secp256k1');
const ecdhB = crypto.createECDH('secp256k1');

// 生成並設置ECDH密鑰對
ecdhA.generateKeys();
ecdhB.generateKeys();

// 使用對方的公鑰和自己的私鑰生成共享密鑰
const sharedSecretA = ecdhA.computeSecret(ecdhB.getPublicKey());
const sharedSecretB = ecdhB.computeSecret(ecdhA.getPublicKey());

// 檢查兩個共享密鑰是否相等
console.log(sharedSecretA.toString('hex') === sharedSecretB.toString('hex')); // 應該輸出true

// 使用共享密鑰進行AES對稱加密
const iv = crypto.randomBytes(16); // 隨機生成初始化向量
const cipher = crypto.createCipheriv('aes-256-gcm', sharedSecretA.slice(0, 32), iv);
let encrypted = cipher.update('Hello, world!', 'utf8', 'hex');
encrypted += cipher.final('hex');
const tag = cipher.getAuthTag().toString('hex');

console.log('Encrypted message:', encrypted, 'Tag:', tag);

// 使用共享密鑰進行AES對稱解密
const decipher = crypto.createDecipheriv('aes-256-gcm', sharedSecretB.slice(0, 32), iv);
decipher.setAuthTag(Buffer.from(tag, 'hex'));
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');

console.log('Decrypted message:', decrypted); // 應該輸出Hello, world!
