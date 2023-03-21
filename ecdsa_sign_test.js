//準備測試拿keyPair簽章 ，然後拿new_keyPair驗證簽章
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const keyPair = ec.genKeyPair();

const privateKey = keyPair.getPrivate().toString('hex');

const privateKey2 = keyPair.getPrivate('hex');


const privateKeyBuffer = Buffer.from(privateKey, 'hex');
const new_keyPair = ec.keyFromPrivate(privateKeyBuffer);


const msg = "123";
const singed = keyPair.sign(msg);
console.log(singed);



const result = new_keyPair.verify(msg,singed);
console.log(result);