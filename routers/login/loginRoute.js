const router = require('express').Router()
const db_fun = require('../../db_fun.js');
const ecdsa = require('../../ECDH_server.js');


const bodyParser = require('body-parser');
router.use(bodyParser.json());

router.post('/login',async  (req , res) => {
  if (typeof req.body.displayName === 'undefined' || typeof req.body.name === 'undefined') {
    res.status(400).json({ error: 'Missing required parameters' });
    return;
  }
  const {displayName, name } = req.body;
  try {
    const result = await ecdsa.main(displayName, name);
    console.log("Encrypted message",result);
    res.status(200).send(result);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

  
});

module.exports = router;
