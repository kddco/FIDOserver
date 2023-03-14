const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// 資料庫帳號密碼
const username = 'fidoadmin';
const password = 'grknwefgkr';
const IP='192.168.209.134';
// 資料庫連線字串
const dbURI = `mongodb://${username}:${password}@${IP}:27017/fido`;

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');

  // 定義資料模型
  const Schema = mongoose.Schema;
  const dataSchema = new Schema({
    svcinfo: {
      did: Number,
      protocol: String,
      authtype: String,
      svcusername: String,
      svcpassword: String
    },
    payload: {
      username: String,
      displayname: String,
      options: {
        attestation: String
      },
      extensions: String
    }
  });

  // 定義資料模型
  const Data = mongoose.model('Data', dataSchema, 'test');

  // 路由定義
  app.post('/data', (req, res) => {
    const newData = new Data(req.body);
    newData.save()
      .then(() => {
        res.send('Data saved successfully');
      })
      .catch((err) => {
        res.status(400).send('Unable to save data');
      });
  });

  // 啟動伺服器
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
})
.catch((err) => {
  console.log('Error connecting to MongoDB', err);
});