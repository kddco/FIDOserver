const router = require('express').Router();
const db_fun = require('../../db_fun.js');
const ecdsa = require('../../ECDH_server.js');
const { spawn } = require('child_process');
const path = require('path');

router.post('/login', async (req, res) => {
  if (typeof req.body.displayName === 'undefined' || typeof req.body.name === 'undefined') {
    res.status(400).json({ error: 'Missing required parameters' });
    return;
  }
  const { displayName, name } = req.body;

  const id = Date.now().toString();

  // to JSON function
  function convertToJSON(encrypted, ivhexData) {
    const data = {
      encrypted: encrypted,
      ivhexData: ivhexData,
    };

    const json = JSON.stringify(data);
    return json;
  }

  try {
    const [encrypted, ivhexData] = await ecdsa.main(displayName, name);
    const jsonData = convertToJSON(encrypted, ivhexData);
    console.log('Encrypted message', jsonData);

    const childProcess = spawn('node', [path.join(__dirname, 'work.js'), displayName, name]);
    childProcess.on('error', (err) => {
      console.error('Child process error:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
    childProcess.on('exit', (code) => {
      if (code === 0) {
        res.status(200).send(jsonData);
      } else {
        console.error('Child process exited with code', code);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
