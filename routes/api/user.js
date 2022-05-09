const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const multer = require('multer');
const multerStorage = multer.diskStorage({ 
    destination: (req, file, cb) => {
        cb(null, 'client/src/imgs/avatars');
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `user-${req.user.id}-${Date.now()}.${ext}`)
    }
});
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        return cb(new Error('Only images allowed!', 400), false);
    }
}
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });


const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Texts = require('../../models/Texts');
const Comments = require('../../models/Comment');

// @route   POST /api/user/avatar/
// @desc    Upload/update avatar 
// @access  Private
router.post('/avatar', [ auth, upload.single('avatar') ], async(req, res) => {
    // console.log(req.body);
    console.log(req.file);
    try {
        const user = await User.updateOne( { _id: req.user.id }, { $set: { avatar: req.file.filename } } );
        res.json(user);

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});





// @route   GET /api/user
// @desc    Get all users route
// @access  Public
router.get('/', async (req, res) => {
    try {
        const user = await User.find().select('-password');

        res.json(user);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }   
});


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

        const { email, username, password } = req.body;

        try {
            // Search for user by email
            let userE = await User.findOne({ email });
            let userN = await User.findOne({ username })

            // Check if user email already exists
            if (userE) {
                return res.status(400).json({ errors: [{ msg: 'Email already in use' }] });
            }

            if (userN) {
                return res.status(400).json({ errors: [{ msg: 'Username already exists' }] });
            }

            user = new User({
                email, username, password
            })

            // Encrypt pwd
            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);

            // Save user in the DB
            await user.save();

            // Return jsonwebtoken
            // Set payload to id from mongoDb users
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
        await Texts.deleteMany({ user: req.user.id });
        //Remove comments
        await Comments.deleteMany({ user: req.user.id });
        //Remove user
        await User.deleteOne({ _id: req.user.id });

        res.json({ msg: 'User deleted' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

module.exports = router;
