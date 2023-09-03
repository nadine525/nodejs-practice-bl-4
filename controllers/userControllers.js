const User = require("../db/models/userModel");

const jwt = require("jsonwebtoken")

const { SECRET_KEY } = process.env;

const signup = async (req, res) => {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        res.status(409).json({ message: "email in use" });
        return;
    }
    const newUser = new User({ name, email, password });
    await newUser.hashPassword(password);
    await newUser.save();

    const payload = {
        id: newUser._id,
    }

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(newUser._id, { token });

    res.status(201).json({ user: { name, email }, token });
}

module.exports = {signup}



