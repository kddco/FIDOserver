const router = require('express').Router()
const db_fun = require('../../db_fun.js');
const ecdsa = require('../../ECDSA_fun.js');


const bodyParser = require('body-parser');
router.use(bodyParser.json());

router.post('/login', (req , res) => {
  if (typeof req.body.reqid === 'undefined' || typeof req.body.displayName === 'undefined' || typeof req.body.name === 'undefined') {
    res.status(400).json({ error: 'Missing required parameters' });
    return;
  }
  const { reqid, displayName, name } = req.body;
  
  const publicKeyHex =db_fun.connectionDB_login_find(displayName,name);


  res.status(200).send(publicKeyHex);

  
});

module.exports = router;
