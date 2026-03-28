const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

async function registerController(req, res) {
    try {
        const { username, email, password } = req.body;

        const isUserAlreadyExists = userModel.findOne({
            email
        });

        if (isUserAlreadyExists) {
            return res.status(409).json({
                "msg": "User already exists",
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            username,
            email,
            password: hashedPassword
        });

        const token = jwt.sign({
            id: user.id
        }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            "msg": "user registration successful",
            "success": true,
            user
        });

    } catch (error) {
        return res.status(500).json({
            "msg": "Internal server error",
            success: false
        });
    }
}

module.exports = {
    registerController
}