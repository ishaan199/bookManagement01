const UserModel = require('../model/UserModel');
const jwt = require('jsonwebtoken');
const validation = require('../validation/validation');
const userRegister = async (req,res) => {
    try{
        const data  = req.body;
        const {title, name, phone, email, password, address} = data;
        const allData = await UserModel.find();
        // console.log(allData)
        // req.title = title.toLowerCase();


        //Checking the request body for the field
        if(Object.keys(req.body).length < 1){
            return res.status(400).send({status:false,msg:"Please provide some data to process"})
        }

        //Title
        if(!validation.isEmpty(title)){
            return res.status(400).send({status:false,msg:"Please fill the field using ['Mr','Mrs','Ms']"})
        }
        if(validation.isEmpty(title)){
            const enums = ["Mr", "Mrs", "Ms", "mr", "mrs", "ms"];
            let result = enums.includes(title);
            if(!result){
                return res.status(400).send({status:false,msg:"Please fill the field using ['Mr','Mrs','Ms']" });
            };
        };

        //Name
        if(!validation.isEmpty(name)){
            return res.status(400).send({status:false,msg:"Please fill the field"});
        };
        if(!validation.isValidName(name)){
            return res.status(400).send({status:false,msg:"Provide proper name"});
        };
        if(validation.isValidName(name)){
            let regex = /[a-zA-Z]/;
            if(!regex.test(name)){
                return res.status(400).send({status:false,msg:"Enter only letters"});
            };
        };

        //Phone
        if(!validation.isEmpty(phone)){
            return res.status(400).send({status:false,msg:"enter the phone number"});
        };
        if(!validation.isEmpty(phone)){
            return res.status(400).send({status:false,msg:"Enter a valid Phone numbers"});
        };
        if(phone){
        if(validation.isValidPhone(phone)){
            const checkPhone = allData.map(ele => ele.phone === phone);
            
            if(checkPhone[0]){
                return res.status(400).send({status:false,msg:"This Phone is already registered"});
            };
        };
    };

        //Email
        if(!validation.isEmpty(email)){
            return res.status(400).send({status:false,msg:"Please Enter the Email"})
        };
        if(!validation.isValidEmail(email)){
            return res.status(400).send({status:false,msg:"Please provide a valid email id"})
        };
        if(email){
            const checkEmail = allData.map(ele => ele.email === email);
            if(checkEmail[0]){
                return res.status(400).send({status:false,msg:"This Email is already registered"});
            };
        };

        //Password
        if(!validation.isEmpty(password)){
            return res.status(400).send({status:false,msg:"Please enter the password"});
        }
        if(password){
            const size = Object.keys(password.trim()).length;
            if(size < 8 || size > 15){
                return res.status(400).send({status:false,msg:"Please provide password with minimum 8 and maximum 14 characters"})
            };
        };

        let saveData = await UserModel.create(data);
        res.status(201).send({status:true,data:saveData});
    }catch(error){
        res.status(500).send({status:false,error:error.message});
    };
};


const userLogin = async (req,res) => {
    try{
        const data = req.body;
        const {email, password} = data;

        if(!validation.isEmpty(email)){
            return res.status(400).send({status:false,msg:"Enter the email."});
        };
        if(!validation.isValidEmail(email)){
            return res.status(400).send({status:false,msg:"Please provide some valid email"});
        };

        if(!validation.isEmpty(password)){
            return res.status(400).send({status:false,msg:"Enter the password"});
        };
        const credData = await UserModel.findOne({email:email,password:password});
        if(!credData){
            return res.status(400).send({status:false,msg:"The email/password is not matched"})
        };
        const token = jwt.sign({
            userId : credData._id.toString(),
        },"project-4", {expiresIn:"180m"});

        res.status(201).send({status:true,data:{token}});
        
    }catch(error){
        return res.status(500).send({status:false,error:error.message})
    }
}


module.exports.userRegister = userRegister;
module.exports.userLogin = userLogin;
