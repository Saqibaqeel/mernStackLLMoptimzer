const User = require('../models/userModel');
const generateToken = require('../utility/generateToken');

const signUp = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!email || !password || !fullName) {
            return res.status(400).json({ msg: 'Please fill all the fields' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Create new user without hashing password
        const newUser = new User({ fullName, email, password });
        await newUser.save();

        generateToken(newUser._id, res);

        res.status(201).json({
            msg: 'User registered successfully',
            user: {
                id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ msg: 'Please fill all the fields' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Plaintext password comparison
        if (password !== user.password) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        generateToken(user._id, res);

        res.status(200).json({
            msg: 'User logged in successfully',
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic,
            },
        });

    } catch (error) {
        console.log('Error while login', error);
        res.status(500).json({ msg: 'Server Error' });
    }
};

const logout = (req, res) => {
    res.clearCookie('jwt');
    res.status(200).json({ msg: 'User logged out successfully' });
};

const updateProfilePic = async (req, res) => {
    try {
        console.log("Received File:", req.file);

        if (!req.file) {
            return res.status(400).json({ msg: "No file uploaded. Ensure the key is 'profilePic'." });
        }

        const profilePicPath = req.file.path;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        user.profilePic = profilePicPath;
        await user.save();

        res.status(200).json({
            msg: "Profile picture updated successfully",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic,
            },
        });
    } catch (error) {
        console.error("Error while updating profile picture:", error);
        res.status(500).json({ msg: "Server Error" });
    }
};

const check = (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ msg: "Unauthorized" });
        }
        res.status(200).json({ msg: "User authenticated", user });
    } catch (error) {
        console.error("Error while checking authentication:", error);
        res.status(500).json({ msg: "Server Error" });
    }
};

module.exports = { signUp, login, logout, updateProfilePic, check };
