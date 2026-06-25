const loginService = require("../services/logIn");

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        const loginResult = await loginService.login(email, password);

        return res.status(200).json({
            message: "Login successful",
            user: loginResult.user,
            token: loginResult.token
        });
    } catch (error) {
        return res.status(error.statusCode || 401).json({
            message: error.message || "Invalid email or password"
        });
    }
}
module.exports = { loginUser };
