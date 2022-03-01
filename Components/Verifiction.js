const JWT = require('../index')

const Verify_token =(req,res,next)=>{
    if(req.headers.authorization!==null){
        console.log(req.headers.authorization);
        next();
    }
    else{
        return res.json({status:501,message:"invalid token"})
    }
  
} 

module.exports = Verify_token