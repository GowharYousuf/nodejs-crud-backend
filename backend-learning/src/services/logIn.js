const User = require("../models/user");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/utils");

function createHttpError(statusCode, message) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

async function login(email, password) {
    try {
        const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

        if (!normalizedEmail || !password) {
            throw createHttpError(400, "Email and password are required");
        }

        const existingUser = await User.findOne({ email: normalizedEmail });

        if (!existingUser) {
            throw createHttpError(401, "Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordValid) {
            throw createHttpError(401, "Invalid email or password");
        }

        const token = generateToken(existingUser);
        const user = existingUser.toJSON();

        return {
            user,
            token
        };
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
}

module.exports = { login };
