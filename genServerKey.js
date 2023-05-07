const fs = require('fs');
const crypto = require('crypto');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

// 生成私鑰和公鑰
const keyPair = ec.genKeyPair();
const privateKey = keyPair.getPrivate().toString('hex');
const publicKey = keyPair.getPublic().encode('hex');

// 將私鑰儲存到檔案
fs.writeFile('ServerPrivateKey.txt', privateKey, (err) => {
  if (err) throw err;
  console.log('私鑰已成功儲存到 ServerPrivateKey.txt');
});

// 將公鑰儲存到檔案
fs.writeFile('ServerPublicKey.txt', publicKey, (err) => {
  if (err) throw err;
  console.log('公鑰已成功儲存到 ServerPublicKey.txt');
});
