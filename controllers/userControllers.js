const path = require("path");
const fs = require("fs/promises");

const User = require("../db/models/userModel");

const jwt = require("jsonwebtoken");

const { SECRET_KEY } = process.env;

const updateAvatar = async (req, res) => {
  const avatarDir = path.join(__dirname, "../", "public", "avatar");
  if (!req.file) {
    res.status(400).json({ message: "File is not exist" });
  }
  const { path: tempUpload, originalname } = req.file;
  const { _id } = req.user;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarDir, filename);
  await fs.rename(tempUpload, resultUpload);

  const avatarURL = path.join("avatar", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({ avatarURL });
};

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
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(newUser._id, { token });

  res.status(201).json({ user: { name, email }, token });
};

const login = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401).json({ message: "Password or email are wrong" });
    return;
  }

  const isEqual = await user.comparePassword(password);
  if (!isEqual) {
    req.status(401).json({ message: "Password or email are wrong" });
    return;
  }

  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

  await User.findByIdAndUpdate(user._id, { token });
  res.json({ user: { name, email }, token });
};

const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });
    res.status(204).send();
  } catch (error) {
    console.log(error);
  }
};

const getCurrent = (req, res, next) => {
  try {
    const { email, name } = req.user;
    res.json({ name, email });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { signup, login, logout, getCurrent, updateAvatar };
