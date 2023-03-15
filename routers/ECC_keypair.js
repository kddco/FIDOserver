const express = require('express');

const router = express.Router();

const ecc = require('../ECDSA_fun.js');

// Route to generate ECDSA key pair and return public key
router.get('/getkeypairhex', (req, res) => {
  console.log("/getkeypairhex");

  const EC = require('elliptic').ec;
  const ec = new EC('secp256k1');
  const keyPair = ec.genKeyPair();



  const publicKeyHex = keyPair.getPublic('hex');
  // console.log(keyPair.getPublic('hex'));
  const privateKeyHex = keyPair.getPrivate('hex');
  // console.log(keyPair.getPrivate('hex'));



  
  
  // Send public key as JSON response
  res.json({ publicKeyHex, privateKeyHex });
});

module.exports = router;