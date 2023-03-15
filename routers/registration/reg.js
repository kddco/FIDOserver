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
    // console.log(req.body);
    
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
      console.log("前註冊 req.session.reqid：",req.session.reqid);
      // console.log("req.sessionID：",req.sessionID);


    }
  
  
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
router.post('/register' , (req , res,)=>{
    // router code here
    // res.send('/register');
    console.log(req.session);
    const { rp,user } = req.body;
    const{reqid,type,app} = rp;
    const {id,name,displayName} = user;
    
    var challenge = require('../../challenge_fun.js');

    if(!req.session){
      res.status(400).send('please preregister first，session不存在');
      return;

    }
    if (!req.session.reqid || !req.session.type || !req.session.app ||
      !req.session.id || !req.session.name || !req.session.displayName) {
      res.status(400).send('Please call /preregister first');
      return;
    }

    //檢查JSON格式中值是否有空
    if((!rp || typeof rp.reqid === 'undefined' || typeof rp.type === 'undefined' || typeof rp.app === 'undefined' ||
    typeof user.id === 'undefined' || typeof user.name === 'undefined' || typeof user.displayName === 'undefined')){
      res.status(400).send('please preregister first,參數錯誤');
      
      return;
    }
    console.log("註冊 req.session.displayName",req.session.displayName);
    // console.log(req.session.rp);
    // if (req.session && req.session.reqid && req.session.type && req.session.app
    //   && req.session.id && req.session.name && req.session.displayName) {
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




});

module.exports  = router