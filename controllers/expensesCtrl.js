const { getCategories, expensesSum, calcPercent, getMonth, getDate, getAll, getMonthly } = require("../help/functionHelp");
const { expensesModel } = require("../models/expensesModel");
const { UserModel } = require("../models/userModel");
const { validateExpenses } = require("../validations/expensesValid")
exports.expensesCtrl = {

    getExpensesById: async (req, res) => {
        let expensId = req.params._id
        try {
            let data = await expensesModel.findOne({ $and: [{ user_id: req.tokenData._id }, { _id: expensId }] })
            res.json(data);
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ msg: "there error try again later", err })
        }

    },
    searchCtegory: async (req, res) => {
        let month= req.query.month;
        let year= req.query.year;
        let sort = req.query.sort || "_id";
        let reverse = req.query.reverse == -1 ? -1 : 1;

        try {

            let queryS = req.query.s;
            let searchReg = new RegExp(queryS, "i");
            let data = await expensesModel.find({ $and: [{ category: searchReg }, { user_id: req.tokenData._id }] })
                .sort({ [sort]: reverse })

            const bodyData = getMonth(data,month,year)
            res.json(bodyData);
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ msg: "there error try again later", err })
        }
    },
    byAmount: async (req, res) => {
        const min = req.query.min || 1;
        const max = req.query.max || 40;
        const userMonth = req.query.month;
        const userYear = req.query.year;

        const searchReg = req.query.category
        try {

            if (max && min) {
                let data = await expensesModel.find({ $and: [{ amount: { $gte: min } }, { amount: { $lte: max } }, { user_id: req.tokenData._id }, { category: searchReg }] })
                    .sort({ revers: -1 })
                const bodyData = getMonth(data,userMonth, userYear)
                res.json(bodyData);
            } else {
                let data = await expensesModel.find({ user_id: req.tokenData._id })
                const bodyData = getMonth(data,userMonth, userYear)
                res.json(bodyData);
            }

        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "there error try again later", err })
        }

    },
    byDate: async (req, res) => {
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;
        const searchReg = req.query.category
        try {
            let data = await expensesModel.find({ $and: [{ user_id: req.tokenData._id }, { category: searchReg }]})
            .sort({ revers: -1 })
            const bodyData = getDate(data,startDate,endDate)
            res.json(bodyData);

        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "there error try again later", err })
        }

    },
    byMonthly: async (req, res) => {
        const searchReg = req.query.category
        const userMonth = req.query.month;
        const userYear = req.query.year;
        const min = req.query.min || 1;
        const max = req.query.max || 1000000;
        const monthly ='yes';
        try {
            let data = await expensesModel.find({ $and: [{ user_id: req.tokenData._id }, { category: searchReg },{monthly:monthly},{ amount: { $gte: min } }, { amount: { $lte: max } }]})
            .sort({ revers: -1 })
            const bodyData=getMonthly(data,userMonth, userYear)
            res.json(bodyData);

        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "there error try again later", err })
        }

    },
    postExpenses: async (req, res) => {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let validBody = validateExpenses(req.body);
        if (validBody.error) {
            return res.status(400).json(validBody.error.details);
        }
        try {
            let expenses = new expensesModel(req.body);
            expenses.user_id = req.tokenData._id;
            let e = expenses.name.substring(1)
            let w = expenses.name.substring(0, 1).toUpperCase()
            expenses.createdAt = year + "-" + month + "-" + day;
            if (month <= 9 && day <= 9) {
                expenses.createdAt = year + "-0" + month + "-0" + day;
            }
            else if (month <= 9) {
                expenses.createdAt = year + "-0" + month + "-" + day;
            }
            else if (day <= 9) {
                expenses.createdAt = year + "-" + month + "-0" + day;
            }
            expenses.name = w + e
            await expenses.save();
            res.status(201).json(expenses);
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ msg: "there error try again later", err })
        }
    },
    idEtid: async (req, res) => {
        let validBody = validateExpenses(req.body);
        if (validBody.error) {
            return res.status(400).json(validBody.error.details);
        }
        try {
            let idEtid = req.params._id;
            let data = await expensesModel.updateOne({ _id: idEtid }, req.body)
            res.json(data);

        }
        catch (err) {
            console.log(err);
            res.status(500).json({ msg: "there error try again later", err })
        }
    },
    deleteExpenses: async (req, res) => {
        try {
            let delId = req.params._id;
            let data;
            // אם אדמין יכול למחוק כל רשומה אם לא בודק שהמשתמש
            // הרשומה היוזר איי די שווה לאיי די של המשתמש
            if (req.tokenData.role == "admin") {
                data = await expensesModel.deleteOne({ _id: delId })
            }
            else {
                data = await expensesModel.deleteOne({ _id: delId, user_id: req.tokenData._id })
            }
            res.json(data);
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ msg: "there error try again later", err })
        }
    }, infoByCategory: async (req, res) => {
        let month= req.query.month;
        let year= req.query.year;
       
        try {
            const myExpenses = []
            let categories = []
            const expensesData = await expensesModel.find({ user_id: req.tokenData._id })
            const bodyData = getAll(expensesData,month,year)
            if (bodyData.length) {
                categories = getCategories(bodyData)
            }

            for (let i = 0; i < categories.length; i++) {
                const cat = categories[i];
                const catExpensesFilter = bodyData.filter((item) => item.category == cat)
                console.log(bodyData)
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
    incomeMinExpenses: async (req, res) => {
        let month= req.query.month;
        let year= req.query.year;
        try {
            const myExpenses = []
            let categories = []
            const expensesData = await expensesModel.find({ user_id: req.tokenData._id })
            const bodyData = getAll(expensesData,month,year)
            if (bodyData.length) {
                categories = getCategories(bodyData)
            }

            for (let i = 0; i < categories.length; i++) {
                const cat = categories[i];
                const catExpensesFilter = bodyData.filter((item) => item.category == cat)
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
    }
}