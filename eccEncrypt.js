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
// getKeyPair();



//以下是ECC加密
function encryptToken(token, publicKeyHex) {
    const publicKey = ec.keyFromPublic(publicKeyHex, 'hex').getPublic();
  
    // 将令牌编码为 Buffer
    const tokenBuffer = Buffer.from(token);
  
    // 使用 ECC 公钥加密令牌
    const encryptedToken = publicKey
      .encrypt(tokenBuffer)
      .toHex(); // 返回加密后的令牌的原始数据
  
    return encryptedToken;
  }
  
  // 示例用法
  const publicKeyHex = '048351fd4ccff8e245638d65a9e253d6de8f35495f2e005ef95fd9e06d14c3895a6cd4d5a29a49c0e2f6f61bea14ebb1215f08a58671e0f584b6c142dcee63cae9'; // 替换为实际的公钥
  
  var challenge_fun = require('./challenge_fun.js');
  challenge = challenge_fun.get_128bits();
  const tokenToEncrypt = challenge; // 替换为实际的要加密的令牌
  
  const encryptedToken = encryptToken(tokenToEncrypt, publicKeyHex);
  console.log('加密后的令牌:', encryptedToken);


//以下是ECC解密

function decryptData(encryptedData, privateKeyHex) {
    const privateKey = ec.keyFromPrivate(privateKeyHex);
    
    // 解码并提取加密的数据和初始化向量
    const encryptedDataBuffer = Buffer.from(encryptedData, 'hex');
    const iv = encryptedDataBuffer.slice(0, 16);
    const ciphertext = encryptedDataBuffer.slice(16);
  
    // 使用私钥执行解密操作
    const decryptedData = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
        iv: iv
      },
      ciphertext
    );
  
    return decryptedData.toString('utf-8');
  }
  
  // 示例用法
  const privateKeyHex = '349ab76b72062f327e3553fe91ff9aa38984155e1160cea6c32b744ab4a0233b'; // 替换为实际的私钥
  const encryptedData = encryptedToken; // 替换为实际的加密后的数据
  
  const decryptedData = decryptData(encryptedData, privateKeyHex);
  console.log('解密后的数据:', decryptedData);