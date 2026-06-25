const User = require("../models/user");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/utils");

function debugLog(label, payload) {
    if (process.env.NODE_ENV !== "production") {
        console.log(`[auth-debug] ${label}:`, payload);
    }
}

function createHttpError(statusCode, message) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

function redactAuthPayload(payload) {
    if (!payload || typeof payload !== "object") {
        return payload;
    }

    return {
        ...payload,
        password: payload.password ? "[provided]" : payload.password
    };
}

function normalizeEmail(email) {
    if (typeof email !== "string") {
        return "";
    }

    const mailtoMatch = email.match(/mailto:([^)]+)/i);
    const normalizedEmail = mailtoMatch ? mailtoMatch[1] : email;

    return normalizedEmail.trim().toLowerCase();
}

function requireObject(payload, label) {
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
        throw createHttpError(400, `${label} body is required`);
    }
}

function validateSignupData(userData) {
    requireObject(userData, "Signup");

    const name = typeof userData.name === "string" ? userData.name.trim() : "";
    const email = normalizeEmail(userData.email);
    const password = typeof userData.password === "string" ? userData.password : "";

    if (!name || !email || !password) {
        throw createHttpError(400, "Name, email, and password are required");
    }

    if (!email.includes("@")) {
        throw createHttpError(400, "A valid email is required");
    }

    return { name, email, password };
}

function validateLoginData(loginData) {
    requireObject(loginData, "Login");

    const email = normalizeEmail(loginData.email);
    const password = typeof loginData.password === "string" ? loginData.password : "";

    if (!email || !password) {
        throw createHttpError(400, "Email and password are required");
    }

    return { email, password };
}

async function createUser(userData) {
    try {
        debugLog("service createUser input", redactAuthPayload(userData));

        const { name, email, password } = validateSignupData(userData);
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw createHttpError(409, "User with this email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userModelInput = {
            name,
            email,
            password: hashedPassword,
            role: "customer"
        };

        debugLog("service model input", redactAuthPayload(userModelInput));

        const createdUser = new User(userModelInput);
        const savedUser = await createdUser.save();

        return savedUser.toJSON();
    } catch (error) {
        if (error.code === 11000) {
            throw createHttpError(409, "User with this email already exists");
        }

        throw error;
    }
}

async function loginUser(loginData) {
    debugLog("service loginUser input", redactAuthPayload(loginData));

    const { email, password } = validateLoginData(loginData);
    const user = await User.findOne({ email });

    if (!user) {
        throw createHttpError(401, "Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw createHttpError(401, "Invalid email or password");
    }

    const token = generateToken(user);
    const userObj = user.toObject();
    delete userObj.password;

    return {
        user: userObj,
        token
    };
}

module.exports = { createUser, loginUser };
