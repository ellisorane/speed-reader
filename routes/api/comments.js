const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');
const Text = require('../../models/Texts');
const User = require('../../models/User');
const Comment = require('../../models/Comment');


// @route   GET '/api/comments'
// @desc    Get all comments
// @access  Public
router.get('/', async (req, res) => {
    try {
        const comment = await Comment.find().sort({ date: -1 });
        res.json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// @route   POST '/comments'
// @desc    Save a comment
// @access  Private
router.post('/', [auth,
[
    check('comment', 'Comment is required').not().isEmpty(),
]],
async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    
    try {
        const newComment = new Comment({
            comment: req.body.comment,
            user: req.user.id
        })

        const comment = await newComment.save();

        res.json(comment);

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }

});

// @route   POST '/comments/:id'
// @desc    Reply to a comment
// @access  Private
router.post('/:id', [auth,
[
    check('reply', 'Comment is required').not().isEmpty(),
]],
async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    
    try {
        const newComment = new Comment({
            comment: req.body.reply,
            replyTo: req.params.id,
            user: req.user.id
        })

        const comment = await newComment.save();

        res.json(comment);

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }

});

// @route   POST '/comments/edit/:id'
// @desc    Edit a comment
// @access  Private
router.post('/edit/:id', [auth,
[
    check('edit', 'Content is required').not().isEmpty(),
]],
async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const comment = await Comment.updateOne( { _id: req.params.id }, { $set: { comment: req.body.edit } } );
        res.json(comment);

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }

});

// @route   POST '/comments/like/:id'
// @desc    Like a comment
// @access  Private
router.post('/like/:id', auth, async (req, res) => {
    
    try {
        
        const comment = await Comment.updateOne( { _id: req.params.id }, { $push: { likes: req.user.id } } );

        res.json(comment);

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
    
});



// @route   DELETE '/comments/:id'
// @desc    Delete comments by id
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        //If text doesn't exist 
        if (!comment) res.status(404).json({ msg: 'Comment not found' });


        //If not the user who made the text
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({msg: 'User not authorized'})
        }

        await comment.remove();

        res.json({ msg: 'Comment deleted' });
    } catch (error) {
        console.error(error);

        if (error.kind === 'ObjectId') res.status(404).json({ msg: 'Post not found' });

        res.status(500).send('Server Error');
    }
});

module.exports = router;
