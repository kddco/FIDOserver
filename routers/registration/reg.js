const router = require('express').Router()

//解析JSON
const bodyParser = require('body-parser');

router.use(bodyParser.json());


// router.get('/preauthenticate' , (req , res)=>{
//     // router code here
//     res.send('/preauthenticate');
// })

// 設定 /preregister 路由
router.post('/preregister', (req, res) => {
    
    // const { pubKeyCredParams } = req.body;
    // console.log("svcinfo",svcinfo);
    // console.log("payload:",req.body.pubKeyCredParams);
  
    // 驗證請求是否包含必要的參數
    // if (!svcinfo || !payload) {
    //   res.status(400).send('Missing required parameters');
    //   return;
    // }
    // console.log(svcinfo.svcpassword);
    // const { did, protocol, authtype, svcusername, svcpassword } = svcinfo;
    // const { username, displayname, options, extensions } = payload;
  
    // // 驗證每個參數是否存在
    // if (!did || !protocol || !authtype || !svcusername || !svcpassword ||
    //     !username || !displayname || !options || !extensions) {
    //   res.status(400).send('Missing required parameters');
    //   return;
    // }
  
    // 驗證完畢，執行接下來的程式邏輯
    // ...
    const name="123";
    const displayName="kddc";
    res.json({
      "rp": {
        "reqid": "12345A",
        "type": "http",
        "app": "example.com"
      },
      "user": {
        "id": "<base64url-encoded-user-id>",
        "name": "john.doe@example.com",
        "displayName": "kddc"
      },
      "challenge": "<base64url-encoded-challenge>",
      "pubKeyCredParams": {
        "type": "public-key", 
        "alg": -7
      },
      "timeout": 60000,
      "attestation": "direct",
      "authenticatorSelection": {
        "authenticatorAttachment": "platform",
        "userVerification": "preferred"
      }
    });
  });


// register路由
router.post('/register' , (req , res)=>{
    // router code here
    res.send('/register');
})

module.exports  = router