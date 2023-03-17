const router = require('express').Router()


const ecdsa = require('../../ECDSA_fun.js');

//解析JSON
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
// router.use(sessionMiddleware)
// router.get('/preauthenticate' , (req , res)=>{
//     // router code here
//     res.send('/preauthenticate');
// })

// 設定 /preregister 路由
router.post('/preregister', (req, res) => {
    
    const { rp,user } = req.body;
    const{reqid,type,app} = rp;
    const {name,displayName} = user;
    
    var challenge = require('../../challenge_fun.js');
    challenge_code = challenge.get_128bits();
    // console.log(req.body);
    
    //驗證所有參數是否存在
    if((!rp || typeof rp.reqid === 'undefined' || typeof rp.type === 'undefined' || typeof rp.app === 'undefined'
    || typeof user.name === 'undefined' || typeof user.displayName === 'undefined')){
      res.status(400).send('Missing required parameters');
      return;
    }
    else{
      req.session.reqid = reqid;
      req.session.type = type;
      req.session.app=app;
      req.session.name=name;
      req.session.displayName=displayName;
      // console.log("前註冊 req.session.reqid：",req.session.reqid);
      // console.log("req.sessionID：",req.sessionID);


    }
  
  
    res.json({
      "rp": {
        "reqid": reqid,
        "type": type,
        "app": app
      },
      "user": {
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
router.post('/register' , (req , res,)=>{
    // router code here
    // res.send('/register');
    
    const { rp,user } = req.body;
    const {hashedSignedChallenge}=req.body; 
    const {privateKeyHex}=req.body;
    const{reqid,type,app} = rp;
    const {name,displayName} = user;
    
    var challenge = require('../../challenge_fun.js');

    //查看session是否有被設定
    if (typeof req.session === 'undefined') {
      res.status(400).send('please preregister first，session不存在');
      return;

    }
    //檢查session中的值是否為空(無先行呼叫/preregister)
    if (!req.session.reqid || !req.session.type || !req.session.app ||
      !req.session.name || !req.session.displayName) {
      res.status(400).send('Please call /preregister first');
      return;
    }

    //檢查當前請求的JSON格式是否正確
    if((!rp || typeof rp.reqid === 'undefined' || typeof rp.type === 'undefined' || typeof rp.app === 'undefined' ||
    typeof user.name === 'undefined' || typeof user.displayName === 'undefined')){
      res.status(400).send('please preregister first,參數錯誤');
      
      return;
    }
    if (!(req.session.reqid === req.body.rp.reqid
    && req.session.type === req.body.rp.type
    && req.session.app === req.body.rp.app
    && req.session.name === req.body.user.name
    && req.session.displayName === req.body.user.displayName)) {
    // if (req.session.ID === req.body.user.ID){
      console.log("屬性值不一致");
      res.status(400).send('前註冊和註冊的屬性值不一致');
    }

    if (req.session) {
        // 如果會話已經存在，則返回歡迎信息
        // console.log(req.session);    
        res.status(200).send(`Welcome back ${req.session.displayName}!`);
        return;
      }
      else{      
        res.status(400).send('session不存在');
        return;
      }
    
    //開始驗證簽章
    // ecdsa.signature_check();



});

module.exports  = router