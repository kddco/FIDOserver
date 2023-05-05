const router = require('express').Router()

const db_fun = require('../../db_fun.js');
const ecdsa = require('../../ECDSA_fun.js');
// const db = require('../dbRoute.js');
//解析JSON
const bodyParser = require('body-parser');

router.use(bodyParser.json());
// router.use(bodyParser.urlencoded({ extended: true }));
// router.use(sessionMiddleware)
// router.get('/preauthenticate' , (req , res)=>{
//     // router code here
//     res.send('/preauthenticate');
// })


// register路由
router.post('/login', (req , res,)=>{


  // res.send("test");
  // res.end();

  //驗證所有參數是否存在
  if(typeof req.body.reqid === 'undefined' || typeof req.body.displayName === 'undefined' || typeof req.body.name === 'undefined'){
    res.status(400).send('Missing required parameters');
    return;
  }
  const {reqid,displayName,name} = req.body;
 
  var challenge = require('../../challenge_fun.js');

  res.status(200).send("ok");
  //開始驗證簽章
  
  const result = ecdsa.signature_check(req.body.hashedChallengeHex,req.body.hashedSignedMSGHex,req.body.publicKeyHex);
  console.log("signature_check result: ",result);

  function transformJSON(jsonA) {
    const jsonB = {
      publicKeyHex: jsonA.publicKeyHex,
      hashedChallengeHex: jsonA.hashedChallengeHex,
      name: jsonA.user.name,
      displayName: jsonA.user.displayName
    };
  
    return jsonB;
  }
  const jsonB = transformJSON(req.body);
  
  db_fun.connectionDB_insert(jsonB);
  res.status(200).send(result);

  // 儲存到資料庫 or 傳送到對應rp server上
  


});

module.exports  = router