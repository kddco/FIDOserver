const router = require('express').Router();
const db_fun = require('../db_fun.js');
//解析JSON
const bodyParser = require('body-parser');
router.use(bodyParser.json());

//新增資料
router.post('/insert', (req, res) => {
  const data = req.body;
  if (!data.publicKeyHex || !data.name || !data.displayName) {
    res.status(400).send('Missing required parameter(s)');
  } else {
    db_fun.connectionDB_insert(data);
    res.send('Data saved successfully');
  }
});

//查詢資料
router.post('/find', async (req, res) => {
    const data = req.body;
    if (!data.name || !data.displayName) {
      res.status(400).send('Missing required parameter(s)');
    } else {
      try {
        const result = await db_fun.connectionDB_find(data.name, data.displayName);
        res.json(result);
      } catch (err) {
        res.status(500).send('Error finding data');
      }
    }
  });

//export



module.exports  = router