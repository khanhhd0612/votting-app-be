const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, nationalId, password, role } = req.body;
        let errors = {};

        if (!firstName) errors.firstName = ['Họ không được để trống'];
        if (!lastName) errors.lastName = ['Tên không được để trống'];
        if (!email) errors.email = ['Email không được để trống'];
        if (!nationalId) errors.nationalId = ['Số căn cước không được để trống'];
        if (!password) errors.password = ['Mật khẩu không được để trống'];

        if (nationalId && !/^\d{12}$/.test(nationalId)) {
            errors.nationalId = [...(errors.nationalId || []), 'Số căn cước phải gồm đúng 12 chữ số (không chứa chữ, ký tự đặc biệt hoặc khoảng trắng)'];
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ errors });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ errors: { email: ['Email đã được sử dụng'] } });
        }

        const existingNationalId = await User.findOne({ nationalId });
        if (existingNationalId) {
            return res.status(400).json({ errors: { nationalId: ['Số căn cước đã được sử dụng'] } });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            email,
            nationalId,
            password: hashedPassword,
            role: role || 'user',
        });

        await newUser.save();

        res.status(201).json({ message: 'Đăng ký thành công' });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ: ' + error.message });
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body
    const privateKey = process.env.SECRET_KEY
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Thiếu email hoặc password" })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Tài khoản không tồn tại" })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Mật khẩu không đúng" })
        }
        const token = jwt.sign(
            { id: user._id, firstName: user.firstName, lastName: user.lastName, nationalId: user.nationalId, email: user.email, role: user.role },
            `${privateKey}`,
            { expiresIn: "7d" }
        )
        res.status(200).json({ message: "Đăng nhập thành công!", token })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
