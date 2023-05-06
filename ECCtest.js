const crypto = require('crypto');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
function getKeyPair() {
    const keyPair = ec.genKeyPair();
    const publicKeyHex = keyPair.getPublic('hex');
    const privateKeyHex = keyPair.getPrivate('hex');
    console.log("publicKeyHex", publicKeyHex);
    console.log("privateKeyHex", privateKeyHex);
    console.log(keyPair);
    return keyPair;
  }

// 生成一个密钥对
const keyPair = getKeyPair();
const publicKeyHex = keyPair.getPublic('hex');

// 将公钥发送给Bob
const alicePublicKey = publicKeyHex;

// Bob接收到公钥后，使用该公钥生成自己的密钥对
const bob = ec.genKeyPair();

// Bob使用Alice的公钥计算共享密钥
const aliceSharedSecret = keyPair.derive(bob.getPublic());
const bobSharedSecret = bob.derive(keyPair.getPublic());

// 由于双方计算出来的共享密钥相同，因此可以将其用作对称密钥加密的密钥
const encryptionKey = crypto.createHash('sha256').update(aliceSharedSecret.toString()).digest();

// 对数据进行加密
const plaintext = 'Hello, World!';
const iv = crypto.randomBytes(16);
const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);
let encryptedData = cipher.update(plaintext, 'utf8', 'hex');
encryptedData += cipher.final('hex');

// Bob接收到加密数据后，使用共享密钥解密
const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKey, iv);
let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
decryptedData += decipher.final('utf8');

console.log(decryptedData); // 输出：Hello, World!
