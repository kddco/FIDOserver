
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
//load ECDSA
require('./ECDSA_fun');



//load challenge生成函式
var challenge = require('./challenge_fun.js');

//load routers
const testRouters  = require("./test_router.js");
const registerRouters = require('./routers/registration/regRoute.js');
const challengeRouters = require('./routers/challengeRoute.js');
const test_session = require('./test_session.js');
const dbRouters = require('./routers/db.js');

const app = express();
const port = process.env.PORT || 6677;


//設定session
const session = require('express-session');
app.use(session({
  secret: challenge.get_128bits(), // 用於加密會話 ID 的私鑰
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // 設置 cookie 安全性選項
    maxAge: 3600000 // 設置 session cookie 生存期限為 1 小時
  }
}));

// 引入路由
app.use('/test',testRouters);
app.use('/',registerRouters);
app.use('/',challengeRouters);
app.use('/',test_session);
app.use('/',dbRouters);



app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});