const crypto = require('crypto');
const EC = require('elliptic').ec;

var challenge = require('./challenge_fun.js');

// hashSignAndVerify();
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

function sign(keyPair,hashed_challenge){
    //input keyPair,hashed_data
    //out signed

    const signed_data = keyPair.sign(hashed_challenge);
    return signed_data;
}
function signature_check(keyPair,hashed,signed_data){
    //check signature is true for false
    
    // const keyPair = ec.keyFromPrivate(privateKey);


    return keyPair.verify(hashed,signed_data);

}

function getKeyPair(){
    const ec = new EC('secp256k1');
    const keyPair = ec.genKeyPair();
    const publicKeyHex = keyPair.getPublic('hex');
    const privateKeyHex = keyPair.getPrivate('hex');
    // console.log("publicKeyHex",publicKeyHex);
    // console.log("privateKeyHex",privateKeyHex);
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
    privateKeyToKeypair
  };