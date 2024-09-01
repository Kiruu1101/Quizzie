const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const userdata = await User.findOne({ email: email });

        if (userdata) {
            if (await bcrypt.compare(password, userdata.password)) {
                const token = jwt.sign({ uid: userdata._id }, process.env.JWT_SECRET);
                res.status(200).json({ status: "success", msg: "Login successful.", token });
            } else {
                throw Object.assign(Error("Wrong password entered."), { code: 401 });
            }
        } else {
            throw Object.assign(Error("No user found with this email."), { code: 404 });
        }
    } catch (err) {
        next(err);
    }
};

const registerUser = async (req, res, next) => {
    try {
        const { name, email, confirmPassword } = req.body;
        if (await User.findOne({ email: email })) {
            throw Object.assign(Error("User with this email already exists."), { code: 409 });
        } else {
            const hashedPassword = await bcrypt.hash(confirmPassword, 10);
            await User.create({ name, email, password: hashedPassword });
            res.status(200).json({ status: "success", msg: "Registred successfully. Please login now." });
        }
    } catch (err) {
        next(err);
    }
};

const userDashboard = async (req, res, next) => {
    try {
        const userdata = await User.findOne({ _id: req.user });
        res.status(200).json({ status: "success", data: userdata });
    } catch (err) {
        next(err);
    }
};

module.exports = { loginUser, registerUser, userDashboard };