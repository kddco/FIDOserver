const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');


const session = require('express-session');


router.use(bodyParser.urlencoded({ extended: true }));


// 使用 Express 中間件來啟用會話支持

var challenge = require('./challenge_fun.js');
router.use(session({
  secret: challenge.get_128bits(), // 用於加密會話 ID 的私鑰
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // 設置 cookie 安全性選項
}));

// 處理根路由
router.post('/test_session', (req, res) => {
  // 檢查會話是否已經存在
  if (req.session && req.session.username) {
    // 如果會話已經存在，則返回歡迎信息
    res.send(`歡迎回來，${req.session.username}！`);
  } else {
    // 如果會話不存在，則要求用戶輸入名稱
    res.send(`
      <form method="post" action="/login">
        <label for="username">請輸入您的名稱：</label>
        <input type="text" name="username" id="username">
        <button type="submit">登錄</button>
      </form>
    `);
  }
});

// 處理登錄請求
router.post('/login', (req, res) => {
  // 從 GET 請求中獲取用戶名稱
  const { username } = req.body;
  console.log("username",username);
  // 如果用戶名稱已經存在，則在會話中設置 username 屬性
  if (username) {
    req.session.username = username;
  }

  // 重定向到根路由
//   res.redirect('/test_session');
    res.redirect(307, '/test_session');



});

module.exports = router;
