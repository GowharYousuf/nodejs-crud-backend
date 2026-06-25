const express = require('express');
const router = express.Router();
const cors = require('cors');
const { loginUser } = require("../controllers/logIn");

router.use(cors());
router.post('/login', loginUser);

module.exports = router;