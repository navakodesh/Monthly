const { UserModel } = require("../models/userModel");
const { expensesModel } = require("../models/expensesModel");
const { validateUserLogin } = require("../validations/userValid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { config } = require("../config/secret");
const { getCategories, expensesSum, calcPercent } = require("../help/functionHelp");




exports.adminCtrl = {

  login: async(req, res) => {
    const validBody = validateUserLogin(req.body);
    if (validBody.error) {
        return res.status(401).json({ msg_err: validBody.error.details })
    }
    try {
        const admin = await UserModel.findOne({ email: req.body.email })
        if (!admin) {
            return res.status(401).json({ msg_err: "Admin not found" })
        }
        const validPass = await bcrypt.compare(req.body.password, admin.password);
        if (!validPass) {
            return res.status(401).json({ msg_err: "Invalid password" })
        }
        if(admin.role!="admin" ){
          return res.status(401).json({ msg_err: "You are not Admin" })
        }
        const token = jwt.sign({ role: admin.role, _id: admin._id }, config.tokenSecret, { expiresIn: '60min' })
      
        return res.json({ token })
    } catch (err) {
      console.log(err)
        return res.status(500).json({ msg_err: "There was an error signing" });
    }
},

AdminUsersList: async(req,res) => {
    try{
      let data = await UserModel.find({},{password:0}).limit(20);
      res.json(data)
    }
    catch(err){
      console.log(err)
      res.status(500).json({msg:"err",err})
    }  
  }, 
 AdminGetExpenses: async(req,res)=> {
    let perPage = req.query.perPage || 10;
    let page = req.query.page || 1;
    let sort = req.query.sort || "_id";
    let reverse = req.query.reverse == "yes" ? -1 : 1;
  
    try{
      let data = await expensesModel.find({user_id:req.query._id})
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({[sort]:reverse})
      res.json(data);
    }
    catch(err){
      console.log(err);
      res.status(500).json({msg:"there error try again later",err})
    }
  } ,
 AdminSearchCategory: async(req,res) => {
    let sort = {amount:-1};
      try{
    let queryS=req.query.s;
    let searchReg=new RegExp(queryS,"i");
    let data =await expensesModel.find({ $and: [ {category:searchReg}, {user_id:req.query._id} ] }).sort(sort)
        .limit(50)
        res.json(data);
      }
      catch(err){
        console.log(err);
        res.status(500).json({msg:"there error try again later",err})
      }
    },
    AdminByAmount: async(req, res) => {
        const max = req.query.max||40;
        const min = req.query.min||10;
        let sort = {amount:-1};
    
        try {
            if (max && min) {
                let data = await expensesModel.find({ $and: [{ price: { $gte: min } }, { price: { $lte: max } },{user_id:req.query._id} ] }).sort(sort)
                res.json(data)
            } else if (min) {
                let data = await expensesModel.find({ $and: [{ price: { $gte: min } },{user_id:req.query._id} ] }).sort(sort)
                res.json(data)
            } else if (max) {
                let data = await expensesModel.find({ $and: [ { price: { $lte: max } },{user_id:req.query._id} ] }).sort(sort)
                res.json(data)
            } else {
                let data = await expensesModel.find({user_id:req.query._id}).sort(sort)
                res.json(data)
    
            }
         
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "there error try again later", err })
        }
    },
    UserInfoById: async(req, res) => {
      try {
        let idUserInfo = req.params._id;
        // let data = await expensesModel.find({ _id: idUserInfo })
        let userInfo = await UserModel.findOne({_id:idUserInfo},{password:0});
        res.json(userInfo);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
    },
  infoByCategoryById: async (req, res) => {
    let idUser = req.params._id;
    try {

        const myExpenses = []
        let categories = []
        const expensesData = await expensesModel.find({ user_id: idUser})
        if (expensesData.length) {
            categories = getCategories(expensesData)
        }

        for (let i = 0; i < categories.length; i++) {
            const cat = categories[i];
            const catExpensesFilter = expensesData.filter((item) => item.category == cat)
            console.log(expensesData)
            const sum = expensesSum(catExpensesFilter);


            const obj = {
                category: cat,
                amount: sum
            }

            myExpenses.push(obj)
        }


        const sumOFfAllExpensese = expensesSum(myExpenses);
        console.log(sumOFfAllExpensese)
        for (let i = 0; i < myExpenses.length; i++) {
            const item = myExpenses[i];
            console.log(item.amount)
            item.percent = Number((item.amount / sumOFfAllExpensese * 100).toFixed(0));

        }
        console.log(myExpenses)
        return res.json({ myExpenses })
    } catch (err) {
        return res.status(500).json({ msg_err: err })
    }
},
incomeMinExpensesById: async (req, res) => {
  let idUser = req.params._id;

    try {
        const myExpenses = []
        let categories = []
        const expensesData = await expensesModel.find({ user_id: idUser})
        if (expensesData.length) {
            categories = getCategories(expensesData)
        }

        for (let i = 0; i < categories.length; i++) {
            const cat = categories[i];
            const catExpensesFilter = expensesData.filter((item) => item.category == cat)
            const sum = expensesSum(catExpensesFilter);


            const obj = {
                category: cat,
                amount: sum
            }

            myExpenses.push(obj)
        }


        const sumOFfAllExpensese = expensesSum(myExpenses);
        console.log(sumOFfAllExpensese)



        const userInfo = await UserModel.findOne({ _id: req.tokenData._id }, { password: 0 });
        const income1 = userInfo.income
        let currentSituation = income1 - sumOFfAllExpensese
        console.log(income1)
        console.log(currentSituation)
        res.json(currentSituation);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
},deleteUser: async (req, res) => {
  try {
      let delId = req.params._id;
      let data;
      // אם אדמין יכול למחוק כל רשומה אם לא בודק שהמשתמש
      // הרשומה היוזר איי די שווה לאיי די של המשתמש
          data = await UserModel.deleteOne({ _id: delId })
 
      res.json(data);
  }
  catch (err) {
      console.log(err);
      res.status(500).json({ msg: "there error try again later", err })
  }
},
deleteUserExpenses: async (req, res) => {
  try {
      let delId = req.params._id;
      let data;
      // אם אדמין יכול למחוק כל רשומה אם לא בודק שהמשתמש
      // הרשומה היוזר איי די שווה לאיי די של המשתמש
          data = await expensesModel.deleteMany({ user_id: delId })
 
      res.json(data);
  }
  catch (err) {
      console.log(err);
      res.status(500).json({ msg: "there error try again later", err })
  }
},
changeRole: async(req,res) => {
  if(!req.body.role){
    return res.status(400).json({msg:"Need to send role in body"});
  }
  
  try{
    let userID = req.params._id
    // לא מאפשר ליוזר אדמין להפוך למשהו אחר/ כי הוא הסופר אדמין
    if(userID == "63720f982ffc5fc970449769"){
      return res.status(401).json({msg:"You cant change superadmin to user"});
  
    }
    let data = await UserModel.updateOne({_id:userID},{role:req.body.role})
    res.json(data);
  }
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }
}
}
