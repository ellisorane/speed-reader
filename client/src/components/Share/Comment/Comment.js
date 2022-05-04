import { AiFillLike } from 'react-icons/ai';
import { RiDeleteBin2Line, RiEdit2Line } from 'react-icons/ri';
import { format } from 'date-fns';

import Reply from './Reply';

import classes from '../Share.module.css';

const SingleComment = ({ comment, commentData, allUserData, currentUser, onChangeFormData, replyToComment, deleteComment, likeComment }) => {

    let pic;
    let username;

    const showHideReplyInput = () => {

    }

    // Create a function that assign the correct username and profile picture to each comment
    const matchIds = async() => {
        
        await allUserData.forEach(uData => {
            if(uData._id === comment.user) {
                pic = uData.avatar;
                username = uData.username;
            }
        });
    }

    matchIds();

    return (
        <div className={classes.singleComment}>
            <div className={classes.commentUser}>

                <div className={classes.commentUserInfo}>
                    <img src={ pic } alt="User profile pic" />
                    <p><strong>{ username || 'Anon' }</strong></p>
                    
                </div>

                {/* Below will only show if you are the person that left the comment */}
                {
                    currentUser && currentUser._id === comment.user ? 
                    <div className={classes.userActions}>
                        <button className={classes.commentBtn}>{ <RiEdit2Line /> || 'Edit' }</button>
                        <button onClick={ () => deleteComment(comment._id) } className={classes.commentBtn}>{ <RiDeleteBin2Line /> || 'Delete'}</button>
                    </div> 
                    : null
                }

            </div>

            {/* Date */}
            <p>Posted: { format(new Date(comment.date), 'MM-dd-yy') }</p>
            
            {/* Comment */}
            <p>{ comment.comment }</p>

            <div className={classes.commentActions}>
                {/* Like comment */}
                <button 
                onClick={ () => likeComment(comment._id) } 
                className={classes.commentBtn}
                // Disable btn if comment likes array contains user ID - disable if user already liked comment
                disabled={ currentUser && comment.likes.includes(currentUser._id) }
                >
                    { <AiFillLike /> ||'Like'} { comment.likes.length }
                </button>

                {/* Reply button - Maybe  */}
                {/* <button onClick={() => showHideReplyInput()} className={classes.commentBtn}>Reply</button> */}
            </div>

            <hr />


            {/* Replies  */}
            <div className={classes.replies}>
                { commentData ? 
                commentData.map(reply => reply.replyTo === comment._id && 
                <Reply 
                    reply={ reply } 
                    allUserData={ allUserData } 
                    currentUser={ currentUser } 
                    deleteComment= { deleteComment }
                    likeComment={ likeComment }
                    key={reply._id} 
                /> ) 
                : <h2>Loading...</h2> }
                
            </div>

            {/* Reply input  */}
            <form className={classes.replyForm} onSubmit={(e) => replyToComment(e, comment._id)}>
                <input type='text' name="reply" required={ true } onChange={ (e) => onChangeFormData(e) } />
                <input type='submit' value="Leave reply" className={classes.commentBtn} />
            </form>
            
        </div>
    );
}

export default SingleComment;