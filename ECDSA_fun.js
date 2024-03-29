const crypto = require('crypto');
const EC = require('elliptic').ec;

var challenge = require('./challenge_fun.js');

//測試程式碼
// const ec = new EC('secp256k1');
// const keyPair = ec.genKeyPair();
// privateKeyHex = keyPair.getPrivate();
// console.log("privateKeyHex",privateKeyHex);
// const text = challenge.get_128bits();
// const hashed_challenge=hash(text);


// const new_keyPair = ec.keyFromPrivate(privateKeyHex,'hex');

// const signed_data = keyPair.sign(hashed_challenge);
// console.log("signed_data",signed_data);
// const isVerified = ec.verify(hashed_challenge, signed_data, keyPair);
// console.log(isVerified);


// hashSignAndVerify();
function hashSignAndVerify(){
    //完整過程，hash後簽章再驗證
    //hash and sign ,finally check signed
    const ec = new EC('secp256k1');
    const keyPair = ec.genKeyPair();
    const text = challenge.get_128bits();
    const hashed_data=hash(text);
    signed_data=sign(keyPair,hashed_data);
    console.log(signature_check(keyPair,hashed_data,signed_data));
}

function hash(text) {
    const hash = crypto.createHash('sha256').update(text).digest();
    return hash.toString('hex');
}

function sign(privateKeyHex,hashed_challenge){

    const crypto = require('crypto');
    const EC = require('elliptic').ec;
    const ec = new EC('secp256k1');
    
    const new_keyPair = ec.keyFromPrivate(privateKeyHex,'hex');
    // console.log("new_keyPair",new_keyPair);
    var signed_data = new_keyPair.sign(hashed_challenge);

    
    return signed_data;
}
// function signature_check(keyPair,hashed,signed_data){
//     //check signature is true for false
    
//     // const keyPair = ec.keyFromPrivate(privateKey);


//     return keyPair.verify(hashed,signed_data);

// }
function signature_check(arg1,arg2,arg3){
    if (typeof arguments[0] === 'string') {
        return signature_check_clientuse(arg1,arg2,arg3);
    }
    else{
        return signature_check_serveruse(arg1,arg2,arg3);
    }



}

//伺服器本地測試用的
function signature_check_serveruse(keyPair,hashed,signed_data){
    //check signature is true for false
    
    // const keyPair = ec.keyFromPrivate(privateKey);


    return keyPair.verify(hashed,signed_data);

}

//client請求用的
function signature_check_clientuse(hashedChallengeHex,hashedSignedMSGHex,publicKeyHex) {

    const publicKeyHexBuffer = Buffer.from(publicKeyHex, 'hex');

    // 將公鑰轉換為 EC KeyPair
    const EC = require('elliptic').ec;
    const ec = new EC('secp256k1');
    const new_keyPair = ec.keyFromPublic(publicKeyHexBuffer);
    
    const value = hashedSignedMSGHex;
    const signed = JSON.parse(hashedSignedMSGHex);


    const isVerified = new_keyPair.verify(hashedChallengeHex, signed);
    return isVerified;
  }

function getKeyPair(){
    const ec = new EC('secp256k1');
    const keyPair = ec.genKeyPair();
    const publicKeyHex = keyPair.getPublic('hex');
    const privateKeyHex = keyPair.getPrivate('hex');
    // console.log("publicKeyHex",publicKeyHex);
    // console.log("privateKeyHex",privateKeyHex);
    // console.log(keyPair);
    return keyPair;
}
function privateKeyToKeypair(privateKeyHex){
    //input privateKeyHex
    //output Keypair
    const EC = require('elliptic').ec;
    const ec = new EC('secp256k1');

    // console.log("privateKeyToKeypair");

    let new_keyPair = ec.keyFromPrivate(privateKeyHex, 'hex');
    // console.log("new keypair",new_keyPair);
    // console.log("privateKey",new_keyPair.getPrivate('hex'));
    // console.log("publicKey",new_keyPair.getPublic('hex'));
    return new_keyPair;
}





// 導出整個模組

module.exports = {
    hashSignAndVerify,
    hash,
    sign,
    signature_check,
    getKeyPair,
    privateKeyToKeypair,
    signature_check_clientuse
  };