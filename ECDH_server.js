const crypto = require('crypto');
const fs = require('fs');
const challenge_fun = require('./challenge_fun.js');


async function getClientPublicKeyHex(displayName, name){
    const db_fun = require('./db_fun.js');
    const publicKeyHex = await db_fun.connectionDB_login_find(displayName, name);
    return publicKeyHex;
}

function getServerKeyPair() {
    const serverPublicKeyHex = fs.readFileSync('ServerPublicKey.txt', 'utf8');
    const serverPrivateKeyHex = fs.readFileSync('ServerPrivateKey.txt', 'utf8');
    const serverPublicKey = Buffer.from(serverPublicKeyHex, 'hex');
    const serverPrivateKey = Buffer.from(serverPrivateKeyHex, 'hex');

    const server_keypair = crypto.createECDH('secp256k1');
    server_keypair.setPublicKey(serverPublicKey);
    server_keypair.setPrivateKey(serverPrivateKey);

    return server_keypair;
}

function computeSharedSecret(server_keypair, ClientPublicKey) {
    return server_keypair.computeSecret(ClientPublicKey);
}

function encryptMessage(sharedSecret, message) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', sharedSecret.slice(0, 32), iv);
    let encrypted = cipher.update(message, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return { encrypted, iv };
}


function decryptMessage(sharedSecret, encrypted, iv) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', sharedSecret.slice(0, 32), iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

async function main(displayName,name){
    const ClientPublicKeyHex = await getClientPublicKeyHex(displayName,name);
    const ClientPublicKey = Buffer.from(ClientPublicKeyHex, 'hex');

    const server_keypair = getServerKeyPair();
    const sharedSecret = computeSharedSecret(server_keypair, ClientPublicKey);
    const challenge_code = challenge_fun.get_128bits();
    // console.log("challenge_code:",challenge_code);
    const { encrypted, iv } = encryptMessage(sharedSecret, challenge_code);
    const hexData = iv.toString('hex');

    // console.log('Encrypted message: ', encrypted);

    const decrypted = decryptMessage(sharedSecret, encrypted, iv);
    // console.log('Decrypted message: ', decrypted);
    return encrypted;
}
async function decrypt_test(){
    //challenge code '9a6482ed9be27e036351fcdc13e31597'
    const encrypted = '0361f9b5a447e69e1e7bac1b1a98f05b072a1f647e6dccd4baf4a9d3d09276d73090b0845f825b489ffe9dfbeed93463';
    const ClientPublicKeyHex = "0489d4da01a7055b8ad7ebae5090a071fcbdcc757ccd409a12d7f9974f34f05b3717a2c8ae487dc8e9b9288dde3a22385d918119f6dfaf77c894a580730d385333";
    const ClientPublicKey = Buffer.from(ClientPublicKeyHex, 'hex');
    const server_keypair = getServerKeyPair();
    const sharedSecret = computeSharedSecret(server_keypair, ClientPublicKey);
    const ivhex ='1b6b1f38d66fba5e6d1f016ca0deb8fc';
    const iv = Buffer.from(ivhex, 'hex');
    const decrypted = decryptMessage(sharedSecret, encrypted, iv);
    console.log(decrypted);
}   

decrypt_test("mydisplayname2","myid");
// main("mydisplayname2","myid");
module.exports = {
    main: main
  };
  