const router = require('express').Router()


const ecdsa = require('../../ECDSA_fun.js');
const db = require('../dbRoute.js');
//解析JSON
const bodyParser = require('body-parser');

router.use(bodyParser.json());
// router.use(bodyParser.urlencoded({ extended: true }));
// router.use(sessionMiddleware)
// router.get('/preauthenticate' , (req , res)=>{
//     // router code here
//     res.send('/preauthenticate');
// })

// 設定 /preregister 路由
router.post('/preregister', (req, res) => {


    //驗證所有參數是否存在
    if((typeof req.body.rp.reqid === 'undefined' || typeof req.body.rp.type === 'undefined' || typeof req.body.rp.app === 'undefined'
    || typeof req.body.user.name === 'undefined' || typeof req.body.user.displayName === 'undefined')){
      res.status(400).send('Missing required parameters');
      return;
    }

    const { rp,user } = req.body;
    const{reqid,type,app} = rp;
    const {name,displayName} = user;

    var challenge = require('../../challenge_fun.js');
    challenge_code = challenge.get_128bits();
    // console.log(req.body);
    
    console.log("/preregister ");
    console.log(":challenge_code ",challenge_code,);
    console.log('\n','\n');


    req.session.reqid = reqid;
    req.session.type = type;
    req.session.app=app;
    req.session.name=name;
    req.session.displayName=displayName;
    // console.log("前註冊 req.session.reqid：",req.session.reqid);
    // console.log("req.sessionID：",req.sessionID);


  
  
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
  console.log('/register');
  console.log("hashedChallengeHex",req.body.hashedChallengeHex);
  console.log("hashedSignedMSGHex",req.body.hashedSignedMSGHex);
  console.log(req.body.publicKeyHex);
  console.log('\n','\n');

  // res.send("test");
  // res.end();

  //驗證所有參數是否存在
  if((typeof req.body.rp.reqid === 'undefined' || typeof req.body.rp.type === 'undefined' || typeof req.body.rp.app === 'undefined'
  || typeof req.body.user.name === 'undefined' || typeof req.body.user.displayName === 'undefined')){
    res.status(400).send('Missing required parameters');
    return;
  }

  const { rp,user } = req.body;
  const {hashedChallengeHex,hashedSignedChallenge}=req.body; 
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



  
  if(typeof req.body.hashedChallengeHex === 'undefined' || typeof req.body.hashedSignedMSGHex === 'undefined' 
  || typeof req.body.publicKeyHex === 'undefined'){
    res.status(400).send('Challenge相關的參數為空');
    console.log('Challenge相關的參數為空');
    return;
  }

  if (!req.session) {    
      res.status(400).send('session不存在');
      console.log('session不存在');
      return;
    }

  //開始驗證簽章
  
  const result = ecdsa.signature_check(req.body.hashedChallengeHex,req.body.hashedSignedMSGHex,req.body.publicKeyHex);
  console.log("signature_check result: ",result);
  res.status(200).send(result);


  // 儲存到資料庫 or 傳送到對應rp server上
  


});

module.exports  = router