const { Router } = require('express');
const { User } = require("../models/associations");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ message: "Usernmame or password is inccorect" });
        }
        
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );

        res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600000, //1h in milliseconds
        });

        res.status(200).json({ 
            message: "Logged in successfully", 
            user: { 
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.roleId,
            }
        });
    } catch (err) {
        console.error("Error logging in", err);
        res.status(500).json({ message: "Internal server error" });    
    }
});

router.post('/register', async (req, res) => {
    try { 
        const user = req.body;
        const hashedPassword = await bcrypt.hash(user.password, 12);
        user.password = hashedPassword;
        console.log(user);
        await User.create(user);
        res.status(201).json({ message: "Account created succesfully" });
    } catch (err) {
        console.error("Error creating account", err);

        if(err.name === "SequelizeUniqueConstraintError") {
            return res.status(400).json({ message: "User already exists" });
        }

        res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      res.status(200).json({ message: 'Logged out successfully' });
})

module.exports = router;