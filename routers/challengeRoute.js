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
  // console.log("publicKeyHex",keyPair.getPublic('hex'));
  const privateKeyHex = keyPair.getPrivate('hex');
  // console.log("privateKeyHexk",keyPair.getPrivate('hex'));

  console.log("/getkeypairhex")
  console.log("publicKeyHex",publicKeyHex);
  console.log("privateKeyHex",privateKeyHex);
  console.log('\n','\n');


  res.json({ publicKeyHex, privateKeyHex });
});

router.post('/hash' , (req , res)=>{
  // console.log(req.body.challenge_text);
  const hashed = ecdsa.hash(req.body.challenge_text);

  console.log("/hash");
  console.log(hashed);
  console.log('\n','\n');
  res.send(hashed);
  // res.send(ecdsa.hash(req.body.challenge_text))

})

router.post('/sign', (req, res) => {
  // console.log(req.body);
  const privateKeyHex = req.body.privateKeyHex;
  const hashedChallengeHex = req.body.hashedChallengeHex;
  const hashedSignedChallenge = ecdsa.sign(privateKeyHex,hashedChallengeHex);

  console.log('/sign');
  console.log("hashedSignedChallenge",hashedSignedChallenge);
  console.log("privateKeyHex",privateKeyHex);

  console.log('\n','\n');

  // const hashedSignedChallengeBuffer = Buffer.from(hashedSignedChallenge.toDER());
  // const base64Buffer = hashedSignedChallengeBuffer.toString('base64');

  res.send(hashedSignedChallenge);
});

module.exports = router;