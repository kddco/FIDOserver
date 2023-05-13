const crypto = require('crypto');
const fs = require('fs');
// 生成ECDH對象

const serverPublicKeyHex = fs.readFileSync('ServerPublicKey.txt', 'utf8');
const serverPrivateKeyHex = fs.readFileSync('ServerPrivateKey.txt', 'utf8');


// 將hex格式的鑰匙轉換為Buffer
const serverPublicKey = Buffer.from(serverPublicKeyHex, 'hex');
const serverPrivateKey = Buffer.from(serverPrivateKeyHex, 'hex');

// 創建ECDH對象
const server_keypair = crypto.createECDH('secp256k1');

// 設置公鑰和私鑰
server_keypair.setPublicKey(serverPublicKey);
server_keypair.setPrivateKey(serverPrivateKey);





async function getClientPublicKeyHex(displayName,name){
    const db_fun = require('./db_fun.js');
    const publicKeyHex = await db_fun.connectionDB_login_find(displayName,name);
    return publicKeyHex;
}

async function main(){
    const ClientPublicKeyHex = await getClientPublicKeyHex("MydisplayName", "Myname");
    // await new Promise(resolve => setTimeout(resolve, 3000)); // 程式暫停 3 秒
    console.log("ClientPublicKeyHex",ClientPublicKeyHex);
    const ClientPublicKey = Buffer.from(ClientPublicKeyHex, 'hex');
    


    const serverPublicKeyHex = fs.readFileSync('ServerPublicKey.txt', 'utf8');
    const serverPrivateKeyHex = fs.readFileSync('ServerPrivateKey.txt', 'utf8');


    // 將hex格式的鑰匙轉換為Buffer
    const serverPublicKey = Buffer.from(serverPublicKeyHex, 'hex');
    const serverPrivateKey = Buffer.from(serverPrivateKeyHex, 'hex');

    // 創建ECDH對象
    const server_keypair = crypto.createECDH('secp256k1');

    // 設置公鑰和私鑰
    server_keypair.setPublicKey(serverPublicKey);
    server_keypair.setPrivateKey(serverPrivateKey);

    //// 使用對方的公鑰和你的私鑰生成共享的會話鑰匙
    const sharedSecret = server_keypair.computeSecret(ClientPublicKey);
    console.log('Shared secret: ', sharedSecret.toString('hex'));

}
main();