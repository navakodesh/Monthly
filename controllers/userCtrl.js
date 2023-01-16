const { UserModel } = require("../models/userModel");


exports.userCtrl = {

myInfo: async(req,res) => {
    try{
      let userInfo = await UserModel.findOne({_id:req.tokenData._id},{password:0});
      res.json(userInfo);
    }
    catch(err){
      console.log(err)
      res.status(500).json({msg:"err",err})
    }  
  },
  
income: async(req,res) => {
  let userID = req.query._id
    try{
      let data = await UserModel.updateOne({_id:userID},{income:req.body.income})
      res.json(data);
    }
    catch(err){
      console.log(err)
      res.status(500).json({msg:"err",err})
    }  
  },
}
  
