const express = require("express");
const signupRoute = require("./routes/signUp");
const loginRoute = require("./routes/logIn");
const userRoute = require("./routes/user");
const bodyParser = require("body-parser");
const cors = require("cors");
const createAdminAccount = require("./scripts/admin");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

createAdminAccount();

app.use("/auth", signupRoute);
app.use("/auth", loginRoute);
app.use("/api", userRoute);

app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`);
});
