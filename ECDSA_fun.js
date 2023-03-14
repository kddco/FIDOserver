const crypto = require('crypto');
const EC = require('elliptic').ec;

var challenge = require('./challenge_fun.js');
// console.log("128bits random num",challenge.get_128bits());
// hashSignAndVerify();
getKeyPair();



function hashSignAndVerify(){
    //完整過程，hash後簽章再驗證
    //hash and sign ,finally check signed
    const ec = new EC('secp256k1');
    const keyPair = ec.genKeyPair();
    const text = challenge.get_128bits();
    hashed_data=hash(text);
    signed_data=sign(keyPair,hashed_data);
    console.log(signature_check(keyPair,hashed_data,signed_data));
}

function hash(text){
    //input text,output sha256 hashed
    return crypto.createHash('sha256').update(text).digest();
}

function sign(keyPair,hashed_data){
    //input keyPair,hashed_data
    //out signed

    const signed_data = keyPair.sign(hashed_data);
    return signed_data;
}
function signature_check(keyPair,hashed,signed_data){
    //check signature is true for false
    
    return keyPair.verify(hashed,signed_data);

}

function getKeyPair(){
    const ec = new EC('secp256k1');
    const keyPair = ec.genKeyPair();
    const publicKeyHex = keyPair.getPublic('hex');
    const privateKeyHex = keyPair.getPrivate('hex');
    console.log("publicKeyHex",publicKeyHex);
    console.log("privateKeyHex",privateKeyHex);
    return keyPair;
}



// 導出整個模組

module.exports = {
    hashSignAndVerify,
    hash,
    sign,
    signature_check,
    getKeyPair
  };