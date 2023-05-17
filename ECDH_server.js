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

async function main(){
    const ClientPublicKeyHex = await getClientPublicKeyHex("MydisplayName", "Myname");
    const ClientPublicKey = Buffer.from(ClientPublicKeyHex, 'hex');

    const server_keypair = getServerKeyPair();
    const sharedSecret = computeSharedSecret(server_keypair, ClientPublicKey);
    const challenge_code = challenge_fun.get_128bits();
    console.log("challenge_code:",challenge_code);
    const { encrypted, iv } = encryptMessage(sharedSecret, challenge_code);
    console.log('Encrypted message: ', encrypted);

    const decrypted = decryptMessage(sharedSecret, encrypted, iv);
    console.log('Decrypted message: ', decrypted);
}

main();
