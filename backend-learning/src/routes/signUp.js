const express = require("express");
const signUpContainer = require("../controllers/signUp");

const router = express.Router();

router.post("/register", signUpContainer.createUser);
router.post("/signup", signUpContainer.createUser);
router.post("/login", signUpContainer.loginUser);

module.exports = router; 
