const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

async function registerController(req, res) {
    try {
        const { username, email, password } = req.body;

        const isUserAlreadyExists = await userModel.findOne({
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
        if (error.code === 11000) {
            return res.status(409).json({
                msg: "Email already in use",
                success: false
            });
        }

        return res.status(500).json({
            "msg": "Internal server error",
            success: false
        });
    }
}

async function loginController(req, res) {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({
            email
        });

        if (!user) {
            return res.status(404).json({
                "msg": "User not exists",
                success: false
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                "msg": "Wrong credentials",
                success: false
            });
        }

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
            "msg": "user Login successful",
            "success": true,
            user
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                msg: "Email already in use",
                success: false
            });
        }

        return res.status(500).json({
            "msg": "Internal server error",
            success: false
        });
    }
}

async function logoutController(req, res) {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });

        res.status(201).json({
            "msg": "user Logout successful",
            "success": true
        });

    } catch (error) {
        return res.status(500).json({
            "msg": "Internal server error",
            success: false
        });
    }
}

module.exports = {
    registerController,
    loginController,
    logoutController
}