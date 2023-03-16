var challenge_fun = require('./challenge_fun.js');
const ecdsa = require('./ECDSA_fun.js');
const challenge = challenge_fun.get_128bits();


const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const keyPair = ec.genKeyPair();

const publicKeyHex = keyPair.getPublic('hex');
// console.log(keyPair.getPublic('hex'));
const privateKeyHex = keyPair.getPrivate('hex');
// console.log(keyPair.getPrivate('hex'));

const new_keyPair = ecdsa.privateKeyToKeypair(privateKeyHex);
const hashed_challenge = ecdsa.hash(challenge);
const hashedSignedChallenge = ecdsa.sign(new_keyPair,hashed_challenge);
const signature_check_result = ecdsa.signature_check(new_keyPair,hashed_challenge,hashedSignedChallenge);
console.log(signature_check_result);