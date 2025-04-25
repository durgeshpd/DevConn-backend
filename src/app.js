const express = require('express');
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express()
const { validateSignUpData } = require("./utils/validation");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth")

app.use(express.json());
app.use(cookieParser());

// POST /signup - create a new user
app.post("/signup", async (req, res) => {

    try {

        validateSignUpData(req);

        const { firstName, lastName, password, emailId } = req.body;

        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash);

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });

        await user.save();
        res.send("User Added Successfully");
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

app.post("/login", async (req, res) => {

    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId: emailId });

        if (!user) {
            throw new Error("Invalid credentials");
        }
        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid) {

            const token = await user.getJWT();
            res.cookie("token", token);
            res.send("Login Successfull!");
        } else {
            throw new Error("Invalid credentials");
        }

    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

app.get("/profile", userAuth, async (req, res) => {

    try {
        const user = req.user;
        res.send(user);

    } catch (err) {
        res.status(400).send("ERROR :" + err.message);
    }
});

app.post("/sendConnectionRequest", userAuth, async (req , res) => {
    const user = req.user;
    res.send(user.firstName + " sent the connect request");
})

// Connect to DB and start server
connectDB()
    .then(() => {
        console.log("Database connection established...");
        app.listen(3000, () => {
            console.log("Server is listening on port 3000");
        });
    })
    .catch((err) => {
        console.error("Database cannot be connected: " + err.message);
    });
 