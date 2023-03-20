const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

const ecdsa = require('../ECDSA_fun.js');
const challenge = require('../challenge_fun.js');
router.get('/getchallenge',(req,res) => {
  res.send(challenge.get_128bits());
});


router.get('/getkeypairhex', (req, res) => {


  const EC = require('elliptic').ec;
  const ec = new EC('secp256k1');
  const keyPair = ec.genKeyPair();

  const publicKeyHex = keyPair.getPublic('hex');
  // console.log(keyPair.getPublic('hex'));
  const privateKeyHex = keyPair.getPrivate('hex');
  // console.log(keyPair.getPrivate('hex'));

  res.json({ publicKeyHex, privateKeyHex });
});

router.get('/hash' , (req , res)=>{
  console.log(req.body.challenge_text);
  res.send(ecdsa.hash(req.body.challenge_text))

})

router.post('/hashsign', (req, res) => {
  console.log(req.body);
  const privateKeyHex = req.body.privateKeyHex;
  const challenge = req.body.challenge;
  // 使用變數 publicKeyHex 和 privateKeyHex 處理資料
  // console.log('publicKeyHex:', publicKeyHex);
  // console.log('privateKeyHex:', privateKeyHex);
  // console.log('challenge:', challenge);

  const new_keyPair = ecdsa.privateKeyToKeypair(privateKeyHex);
  // console.log("new_keyPair",new_keyPair);
  const hashed_challenge = ecdsa.hash(challenge);
  // console.log("hashed_challenge",hashed_challenge);
  const hashedSignedChallenge = ecdsa.sign(new_keyPair,hashed_challenge);
  // console.log("hashedSignedChallenge",hashedSignedChallenge);
  const response = {
    status: 200,
    message: 'Success',
    hashedSignedChallenge: hashedSignedChallenge
  };
  console.log("response.hashedSignedChallenge",response.hashedSignedChallenge);
  res.json(response);
});

module.exports = router;