const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phone: String,
    role: {
        type: String,
        default: "admin"
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

exports.adminModel = mongoose.model('admins', adminSchema);