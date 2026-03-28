const jwt = require("jsonwebtoken");

async function isAuthenticated(req, res, next) {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                "msg": "token not found",
                success: false
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            msg: "Unauthorized - Invalid token",
            success: false
        });
    }
}

module.exports = {
    isAuthenticated
};