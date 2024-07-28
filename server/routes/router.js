const express = require('express')
const router = express.Router();
const Signup = require('../models/Signup');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const fetchuser = require('../middleware/fetchuser');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator')
const Mailgen = require("mailgen");

const keysecret = "mukeshKaswan"

// email config
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "mkaswan960@gmail.com",
        pass: "sajdrsddnjvwcots"
    }
})

let MailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "Mailgen",
        link: "https://mailgen.js/"
    }
})


router.get("/user", fetchuser, async (req, res) => {
    const user = req.user;
    try {
        const note = await Signup.find({
            _id: user.id
        });
        res.json(note)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occured")
    }
})


// signup api

router.post('/signup', async (req, res) => {
    // destructure the value of name, email, password form frontend(req.body)
    const { name, email, password } = req.body;
    // check email and password is not blanck
    if (!email || !password) {
        res.status(422).json({ error: "fill all the details" })
    }
    try {
        // hash the password using salt of 10
        const salt = await bcrypt.genSalt(10);
        const pass = await bcrypt.hash(req.body.password, salt);
        // check data is present 
        const savedEmail = await Signup.findOne({ email: email })
        // if data exist than return error 
        if (savedEmail) {
            res.status(404).json({ error: "This Email is Already Exist" });
        } else {
            // else condition me save the userdata
            const data = new Signup({ name, email, password: pass })
            // save user data using .save method
            const saveddata = await data.save()
            // return the backend status to frontend
            res.status(201).json({ status: 201, saveddata })
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occured")
    }
})


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    // check password and email
    if (!email || !password) {
        res.status(422).json({ error: "fill all the details" })
    }
    try {
        //  check entered eamil is valid or not
        const user = await Signup.findOne({ email: email });
        if (user) {
            // after validation email check for password compare password with users entered password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                res.status(422).json({ error: "invalid details" })
            } else {
                // create token using secret key
                const data = {
                    user: {
                        id: user.id
                    }
                }
                let token23 = jwt.sign(data, keysecret);

                const result = { user, token: token23 }

                res.status(201).json({ status: 201, result })
            }
        } else {
            // console.log("not working")
            res.status(401).json({ status: 401 });
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occured")
    }
})

//Using post generate otp at Reset Password time API

router.post('/generateOTP', async (req, res) => {
    const { email } = req.body
    const user = await Signup.findOne({ email: email });
    if (user) {
        OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
        console.log(OTP)
        res.status(201).send({ code: OTP, user })
    } else {
        return res.status(400).send({ error: "Email does not exist" })
    }
})

//After generating otp send mail API

router.post("/sendMail", async (req, res) => {
    const { email, text, subject } = req.body;
    var Useremail = {
        body: {
            intro: text || "Welcome to UserAuth",
            outro: 'Need help, or have question? Just reply to this email'
        }
    }
    var emailBody = MailGenerator.generate(Useremail);
    let message = {
        from: " mkaswan960@gmail.com",
        to: email,
        subject: subject || "Successfull done",
        html: emailBody
    }
    transporter.sendMail(message)
        .then(() => {
            return res.status(200).send({ msg: "You should receive an email from Us." })
        })
})

//Reset password using put

router.put('/resetPasword', async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body)
    if (!email) {
        res.status(404).send({ msg: "Email is not found" });
    } else {
        try {
            const find = await Signup.findOne({ email: email });
            const salt = await bcrypt.genSalt(10);
            const pass = await bcrypt.hash(password, salt);
            if (find) {
                const data = await Signup.findOneAndUpdate({ email: email }, { $set: { password: pass } }, { new: true })
                res.status(201).send({ data, status: 201 })
                console.log(data)
            } else {
                res.status(404).send({ msg: "Email is not found" })
            }
        } catch (error) {
            res.status(404).send({ msg: "Some error occured" })
        }
    }
})


module.exports = router