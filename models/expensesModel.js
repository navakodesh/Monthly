const mongoose = require('mongoose');

const expensesSchema = new mongoose.Schema({
    category:String,
    name: String,
    user_id:String,
    amount:Number,
     monthly:String,

    createdAt: String
})

exports.expensesModel = mongoose.model('expenses', expensesSchema);