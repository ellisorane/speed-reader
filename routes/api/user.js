const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');
const User = require('../../models/User');


// @route   POST /api/user
// @desc    Sign up user
// @access  Public
router.post(
    '/',
    // Express-validator validates input
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more charactes').isLength({ min: 6 })
        
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            // Search for user by email
            let user = await User.findOne({ email });

            // Check if user email already exists
            if (user) {
                return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
            }

            // Get gravatar
            const avatar = gravatar.url(email, {
                // string length max
                s: '200',
                // Rating
                r: 'pg',
                // Default gravatar
                d: 'mm'
            })

            user = new User({
                email, avatar, password
            })

            // Encrypt pwd
            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);

            await user.save();

            // Return jsonwebtoken
            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: 36000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );

            // res.send('User Registered');

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
        
});

// @route   GET /api/user/current
// @desc    Get current user route
// @access  Private
router.get('/current', auth, async (req, res) => {
    try {
        const user = await User.findOne({ user: req.id }).select('-password');
        console.log(user);

        if (!user) {
            return res.status(400).json({ msg: 'Not logged in' });
        }

        res.json(user);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }   
});


// @route   Delete /api/user/:user_id
// @desc    Delete user and texts
// @access  Private

router.delete('/:user_id', auth, async (req, res) => {
    try {
        //Must remove in this order
        //Remove texts
        // await Texts.deleteMany({ user: req.user.id });
        //Remove user
        await User.findOneAndRemove({ user: req.id });

        res.json({ msg: 'User deleted' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

module.exports = router;
