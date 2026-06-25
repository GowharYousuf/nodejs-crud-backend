const jwt = require('jsonwebtoken');
const { secretKey } = require("../config/jwtConfig");

function authenticateToken(req, res, next) {
    const authHeader = req.get('authorization');

    console.log('authMiddleware headers:', req.headers);
    console.log('authMiddleware authorization header:', authHeader);

    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized, Missing Token' });
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Unauthorized, Invalid Token Format' });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden, Invalid Token' });
        }
        req.user = user;
        next();
    });
}

module.exports = { authenticateToken };