const User = require('../models/User')

exports.getAllUser = async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).json(users)
    } catch (error) {
        console.log(error)
        res.status(404).json({ message: "Lỗi server !" })
    }
}