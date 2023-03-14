
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
//load ECDSA
require('./ECDSA_fun');

//load challenge生成函式
var test = require('./challenge_fun.js');

//load routers
const testRouters  = require("./test_router.js");
const registerRouters = require('./routers/registration/reg.js');
const eccRouters = require('./routers/ECC_keypair.js');
const test_session = require('./test_session.js');


const app = express();
const port = process.env.PORT || 6677;

// set session setting
// const session = require('express-session');

// app.use(session({
//   secret: 'mySecretKey', // 用於加密會話 ID 的私鑰
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: false } // 設置 cookie 安全性選項
// }));


// 引入路由
app.use('/test',testRouters);
app.use('/',registerRouters);
app.use('/',eccRouters);
app.use('/',test_session);



app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});