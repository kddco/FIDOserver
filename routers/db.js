const router = require('express').Router();

//解析JSON
const bodyParser = require('body-parser');
router.use(bodyParser.json());

//import mongo 
const mongoose = require('mongoose');

// 資料庫帳號密碼
const username = 'fidoadmin';
const password = 'grknwefgkr';
const IP='192.168.209.134';

// 資料庫連線字串
const dbURI = `mongodb://${username}:${password}@${IP}:27017/fido`;

//資料庫連線函式
const connectionDB_insert = (user_req) => {
  mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  
    // 資料模型定義
    const dataSchema = new mongoose.Schema({
      publicKeyHex: String,
      hashedChallengeHex: String,
      name: String,
      displayName: String,
    });
    const Data_insert = mongoose.model('Data', dataSchema, 'user');
    
    const newData = new Data_insert(user_req);
    newData.save()
      .then(() => {
        console.log('Data saved successfully');
        mongoose.connection.close();
      })
      .catch((err) => {
        console.error('Unable to save data', err);
        mongoose.connection.close();
      });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });
};

//資料庫查詢函式
const connectionDB_find = async (name, displayName) => {
    try {
      console.log('Connecting to MongoDB');
      await mongoose.connect(dbURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
  
      // 資料模型定義
      const dataSchema = new mongoose.Schema({
        publicKeyHex: String,
        hashedChallengeHex: String,
        name: String,
        displayName: String,
      });
      const Data_find = mongoose.model('Data', dataSchema, 'user');
  
      const data = await Data_find.findOne({name: name, displayName: displayName});
      console.log('Data found', data);
      mongoose.connection.close();
      return data;
    } catch (err) {
      console.error('Error connecting to MongoDB', err);
      throw err;
    }
  };

//新增資料
router.post('/insert', (req, res) => {
  const data = req.body;
  if (!data.publicKeyHex || !data.name || !data.displayName) {
    res.status(400).send('Missing required parameter(s)');
  } else {
    connectionDB_insert(data);
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
        const result = await connectionDB_find(data.name, data.displayName);
        res.json(result);
      } catch (err) {
        res.status(500).send('Error finding data');
      }
    }
  });

module.exports = router;