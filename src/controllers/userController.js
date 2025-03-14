const { User } = require("../models/associations");
const bcrypt = require("bcrypt");


const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    console.err(err);
    res.status(500).json({ message: "Error retrieving users" });
  }
}; 

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    console.log(req.body);
    res.status(201).json(user);
  } catch (err) {
    console.err(err);
    res.status(500).json({ message: "Error creating user" });
  }
}

const findUser = async (req, res) => {
  try{
    const user = await User.findOne({ where: { username: req.body.username } });
    if(!user) {
      return res.status(404).json({ message: "Account doesn't exist" });
    } else res.status(200).json(user);
  } catch (err) {
    console.err(err);
    res.status(500).json({ message: "Error finding user" });
  }
}


module.exports = { getAllUsers, createUser, findUser};
