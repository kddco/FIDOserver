// import mongo 
const mongoose = require('mongoose');

// 資料庫帳號密碼
const username = 'fidoadmin';
const password = 'grknwefgkr';
const IP = '140.125.32.19';
const dbName = 'fido';

// 資料庫連線字串
const dbURI = `mongodb://${username}:${password}@${IP}:27000/${dbName}`;

// 資料模型定義
const dataSchema = new mongoose.Schema({
  publicKeyHex: {
    type: String,
    required: true,
  },
  hashedChallengeHex: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
});

const Data = mongoose.model('Data', dataSchema, 'user');

const loginSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const LoginData = mongoose.model('LoginData', loginSchema, 'user');

// 資料庫連線函式
const connectToDB = () => {
  return mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

// 新增資料函式
const connectionDB_Register_insert = (user_req) => {
  connectToDB()
    .then(() => {
      console.log('Connected to MongoDB');

      const newData = new Data(user_req);
      newData
        .save()
        .then(() => {
          console.log('Data saved successfully');
        })
        .catch((err) => {
          console.error('Unable to save data', err);
        })
        .finally(() => {
          mongoose.connection.close();
        });
    })
    .catch((err) => {
      console.error('Error connecting to MongoDB', err);
    });
};


// 新增資料查詢函式
const connectionDB_login_find = async (displayName, name) => {
  try {
    console.log('Connecting to MongoDB');
    await connectToDB();
    var loginData = await LoginData.find({ "displayName": displayName, "name": name });
    
    const result = JSON.stringify(loginData, null, 2);
    const parsedData = JSON.parse(result);
    const publicKeyHex = parsedData[0].publicKeyHex;
    mongoose.connection.close();

    return publicKeyHex;
  } catch (err) {
    console.error('Error connecting to MongoDB', err);
    throw err;
  }
};


module.exports = {
  connectionDB_Register_insert,
  connectionDB_login_find,
};
