const userService = require("../services/signup");

function redactAuthPayload(payload) {
    if (!payload || typeof payload !== "object") {
        return payload;
    }

    return {
        ...payload,
        password: payload.password ? "[provided]" : payload.password
    };
}

function debugLog(label, payload) {
    if (process.env.NODE_ENV !== "production") {
        console.log(`[auth-debug] ${label}:`, payload);
    }
}

function sendError(res, error) {
    const statusCode = error.statusCode || 500;

    if (process.env.NODE_ENV !== "production") {
        console.error("[auth-debug] controller error:", {
            statusCode,
            name: error.name,
            message: error.message,
            code: error.code
        });
    }

    return res.status(statusCode).json({
        message: error.message || "Internal server error"
    });
}

async function createUser(req, res) {
    try {
        debugLog("controller createUser inputs", {
            body: redactAuthPayload(req.body),
            params: req.params,
            query: req.query
        });

        const createdUser = await userService.createUser(req.body);

        return res.status(201).json({
            message: "User created successfully",
            user: createdUser
        });
    } catch (error) {
        return sendError(res, error);
    }
}

async function loginUser(req, res) {
    try {
        debugLog("controller loginUser inputs", {
            body: redactAuthPayload(req.body),
            params: req.params,
            query: req.query
        });

        const loginResult = await userService.loginUser(req.body);

        return res.status(200).json({
            message: "Login successful",
            user: loginResult.user,
            token: loginResult.token
        });
    } catch (error) {
        return sendError(res, error);
    }
}

module.exports = { createUser, loginUser };
