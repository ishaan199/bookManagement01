const BookModel = require('../model/BookModel')
const jwt = require('jsonwebtoken');


const authentication = (req,res,next) => {
    try{
        let token = req.headers['x-api-key'];
        if(!token){
            return res.status(400).send({status:false,msg:"Token is not present"})
        }
        let decodeToken = jwt.verify(token, "project-4");
        if(decodeToken){
            req.userId = decodeToken.userId;
            next();
        }else{
            return res.status(400).send({status:false,msg:"Token is not valid"})
        }
    }catch(error){
        return res.status(500).send({Status:false,msg:error})
    }
}


module.exports.authentication = authentication;