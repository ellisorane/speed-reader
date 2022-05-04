import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

import SingleComment from './Comment/Comment';
import Spinner from '../Spinner/Spinner';
import { authActions } from '../../store/auth';

import classes from './Share.module.css';

const Share = () => {

    const [formData, setFormData] = useState({
        comment: '',
        reply: ''
    });
    const { comment, reply } = formData;
    const [commentData, setCommentData] = useState();
    const [allUserData, setAllUserData] = useState();
    const currentUser = useSelector(state => state.auth.user);

    const onChangeFormData = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Post comment
    const postComment = async(e) => {
        e.preventDefault();
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const body = JSON.stringify({ comment });
        
        try {
            const res = await axios.post('/api/comments', body, config);
            // console.log(res);
            setFormData({ reply: '', comment: '' });
            loadComments();
        } catch(err) {
            console.log(err);
        }

    }

    // Reply to Comment
    const replyToComment = async(e, id) => {
        // e.preventDefault();

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const body = JSON.stringify({ reply });

        try {
            const res = await axios.post('/api/comments/' + id, body, config);
            // console.log(res);
            loadComments();
        } catch(err) {
            console.log(err);
        }

    }

    // Like Comment 
    const likeComment = async(id) => {
        // Like button will not work if not logged in.
        if(currentUser) {
            try {
                const res = await axios.post ('/api/comments/like/' + id);
                // console.log(res);
                loadComments();
            } catch(err) {
                console.log(err);  
            }
        } else {
            return;
        }

    }

    // Delete Comment
    const deleteComment = async(id) => {
        // console.log(id); 
        try {
            const res = await axios.delete('/api/comments/' + id);
            // console.log(res);
            loadComments();
        } catch(err) {
            console.log(err);
        }

    }

    const getAllUsers = async() => {
        try {
            const res = await axios.get('/api/user');
            setAllUserData(res.data);
        } catch(err) {
            console.log(err);
        }
    }

    const loadComments = async() => {
        try {
            // Get all user data before trying to load the comments
            await getAllUsers();
            const res = await axios.get('/api/comments');
            setCommentData(res.data.reverse());
        } catch(err) {
            console.log(err);
        }
    }


    useEffect(() => {
        loadComments();
    }, []);

    return (
        <div>
            
            <div className={classes.container}>
                <h2 className={classes.pageTitle}>Share your experience</h2>
                <div className={classes.info}>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>

                <div className={classes.commentContainer}>
                    <h3>Comments</h3>
                    <p>Leave a comment about your experience.</p>
                    <form onSubmit={(e) => postComment(e)}>
                        <input type="text" name="comment" required={ true } value={formData.comment} onChange={(e) => onChangeFormData(e)} />
                        <input type="submit" value="Post Comment" className={classes.submitComment} />
                    </form>

                    {/* Only show comments that are not replies to other comments as main comments */}
                    { commentData ?
                    
                    commentData.map( (comment) => !comment.replyTo && 
                        <SingleComment 
                            comment={ comment } 
                            commentData={ commentData } 
                            allUserData={ allUserData } 
                            currentUser={ currentUser } 
                            postComment={ postComment } 
                            onChangeFormData={ onChangeFormData } 
                            replyToComment={ replyToComment } 
                            deleteComment={ deleteComment }
                            likeComment={ likeComment }
                            key={ comment._id } 
                        /> 
                    )
                    : <Spinner /> }

                </div>
            </div>

        </div>
    )
}

export default Share; 