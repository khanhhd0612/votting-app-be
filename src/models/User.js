const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    nationalId: { type: Number, unique: true },
    password: String,
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('User3', userSchema)