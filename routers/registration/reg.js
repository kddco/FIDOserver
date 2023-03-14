const router = require('express').Router()

//解析JSON
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// router.get('/preauthenticate' , (req , res)=>{
//     // router code here
//     res.send('/preauthenticate');
// })

// 設定 /preregister 路由
router.post('/preregister', (req, res) => {
    
    const { rp,user } = req.body;
    const{reqid,type,app} = rp;
    const {id,name,displayName} = user;
    
    var challenge = require('../../challenge_fun.js');
    challenge_code = challenge.get_128bits();
    console.log(req.body);
    
    //驗證所有參數是否存在
    if((!rp || typeof rp.reqid === 'undefined' || typeof rp.type === 'undefined' || typeof rp.app === 'undefined' ||
    typeof user.id === 'undefined' || typeof user.name === 'undefined' || typeof user.displayName === 'undefined')){
      res.status(400).send('Missing required parameters');
      return;
    }
    else{
      req.session.reqid = reqid;
      req.session.type = type;
      req.session.app=app;
      req.session.id=id;
      req.session.name=name;
      req.session.displayName=displayName;
      console.log("req.session：",req.session);
      console.log("req.sessionID：",req.sessionID);


    }
  

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
  
    res.json({
      "rp": {
        "reqid": reqid,
        "type": type,
        "app": app
      },
      "user": {
        "id": id,
        "name": name,
        "displayName": displayName
      },
      "challenge": challenge_code,
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