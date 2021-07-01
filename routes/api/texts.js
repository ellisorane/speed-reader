const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');
const Text = require('../../models/Texts');
const User = require('../../models/User');


// @route   GET '/api/texts'
// @desc    Get all texts that were saved by current user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const text = await Text.find({ user: req.user.id }).sort({ date: -1 });
        res.json(text);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// @route   POST '/texts'
// @desc    Save a text
// @access  Private
router.post('/', [auth,
    [
        check('title', 'Title is required').not().isEmpty(),
        check('content', 'Content is required').not().isEmpty()
    ]],
    async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        
        const user = await User.findById(req.user.id).select('-password');
    
        const newText = new Text({
            title: req.body.title,
            content: req.body.content,
            user: req.user.id
        })

        const text = await newText.save();

        res.json(text);

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }

});

// @route   GET '/texts/:id'
// @desc    Get texts by id
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const text = await Text.findById(req.params.id);

        if (!text) res.status(404).json({ msg: 'Text not found' });

        res.json(text);
    } catch (error) {
        console.error(error);

        if (error.kind === 'ObjectId') res.status(404).json({ msg: 'Text not found' });

        res.status(500).send('Server Error');
    }
});

// @route   DELETE '/texts/:id'
// @desc    Delete texts by id
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const text = await Text.findById(req.params.id);

        //If text doesn't exist 
        if (!text) res.status(404).json({ msg: 'Text not found' });


        //If not the user who made the text
        if (text.user.toString() !== req.user.id) {
            return res.status(401).json({msg: 'User not authorized'})
        }

        await text.remove();

        res.json({ msg: 'Text deleted' });
    } catch (error) {
        console.error(error);

        if (error.kind === 'ObjectId') res.status(404).json({ msg: 'Post not found' });

        res.status(500).send('Server Error');
    }
});

module.exports = router;
