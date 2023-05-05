const crypto = require('crypto');

function encryptToken(token, publicKey) {
  // 使用公钥加密数据
  const encryptedToken = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.NO_PADDING,
    },
    token
  );

  return encryptedToken;
}

// 示例用法
const publicKey = '在这里传入公钥'; // 替换为实际的公钥
const tokenToEncrypt = Buffer.from('要加密的令牌', 'utf-8');

const encryptedToken = encryptToken(tokenToEncrypt, publicKey);
console.log('加密后的令牌:', encryptedToken);
