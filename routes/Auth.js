const User = require('../models/User');
const router = require('express').Router();

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        if (!name || !email || !password || !phone)
            return res.status(400).json({ message: "Please fill all the required fields!" });

        var user = await User.findOne({ email });
        if (user)
            return res.status(400).json({ message: "User already been registered!" });

        user = await User.create({ name, email, password, phone });
        res.status(200).json({ user });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: "Please fill all the required fields!" });

        var user = await User.findOne({ email });
        if (!user || !await user.validatePassword(password))
            return res.status(400).json({ message: "Invalid Credentials" });

        console.log(await user.generateToken());
        res.status(200).json({ user: { user, token: await user.generateToken(), _id: user._id.toString() } });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;