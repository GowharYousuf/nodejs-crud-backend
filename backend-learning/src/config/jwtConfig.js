const crypto = require("crypto");

// generate a random secret key for JWT signing
const secretKey = crypto.randomBytes(32).toString("hex");

module.exports = {
    secretKey,
    expiresIn: "1h" // token expiration time
};