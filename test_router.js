const router = require('express').Router()


router.get('/' , (req , res)=>{
    
    res.send('/test');

})


router.get('/another-route' , (req , res)=>{
    res.send('/another-route');
})



module.exports  = router

