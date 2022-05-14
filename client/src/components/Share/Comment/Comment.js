import { AiFillLike } from 'react-icons/ai';
import { RiDeleteBin2Line, RiEdit2Line } from 'react-icons/ri';
import { format } from 'date-fns';

import Reply from './Reply';

import classes from '../Share.module.css';

const SingleComment = ({ defaultAvatar, formData, editComment, comment, commentData, allUserData, currentUser, onChangeFormData, replyToComment, deleteComment, likeComment, showHideEditField, activeInputFieldID }) => {

    let username;
    let avatar;

    // Create a function that assign the correct username and profile picture to each comment
    const matchIds = async() => {
        
        await allUserData.forEach(uData => {
            if(uData._id === comment.user) {
                username = uData.username;
                avatar = uData.avatar;
            }
        });
    }

    matchIds();

    return (
        <div className={classes.singleComment}>
            <div className={classes.commentUser}>

                <div className={classes.commentUserInfo}>
                    {/* User Profile Picture  */}
                    <img 
                    src={ `/uploads/${avatar}` } 
                    alt="User profile pic" 
                    onError={ (e) => defaultAvatar(e)  }
                    />
                    {/* Username */}
                    <p><strong>{ username || 'Anon' }</strong></p>
                    
                </div>

                {/* Below will only show if you are the person that left the comment */}
                {
                    currentUser && currentUser._id === comment.user ? 
                    <div className={classes.userActions}>
                        {/* Edit Button  */}
                        <button onClick={ () => showHideEditField(comment, 'edit') } className={classes.commentBtn}>{ <RiEdit2Line /> || 'Edit' }</button>
                        {/* Delete Button  */}
                        <button onClick={ () => deleteComment(comment._id) } className={classes.commentBtn}>{ <RiDeleteBin2Line /> || 'Delete'}</button>
                    </div> 
                    : null
                }

            </div>

            {/* Date */}
            <p>Posted: { format(new Date(comment.date), 'MM-dd-yy') }</p>
            
            {/* Comment/Edit */}
            {/* If activeInputFieldID === { id: comment._id, action: 'edit' } then show the edit field, else show the comment */}
            { activeInputFieldID.id === comment._id && activeInputFieldID.action === 'edit' ?
                <form className={classes.editForm} onSubmit={(e) => editComment(e, comment._id) }>
                    <input type='text' name="edit" required={ true } value={ formData.edit } onChange={ (e) => onChangeFormData(e) } />
                    <input type='submit' value="Submit" className={classes.commentBtn} />
                </form>
                : <p>{ comment.comment }</p>
            }           

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

                {/* Reply button */}
                <button onClick={ () => showHideEditField(comment, 'reply') } className={classes.commentBtn}>Reply</button>
            </div>

                {/* Reply Field  */}
                {/* If activeInputFieldID = { id: comment._id, action: 'reply' } then show the reply field, else show nothing */}
                { (activeInputFieldID.id === comment._id && activeInputFieldID.action === 'reply') && 
                <form className={classes.replyForm} onSubmit={(e) => replyToComment(e, comment._id)}>
                    <input type='text' name="reply" value={ FormData.reply } required={ true } onChange={ (e) => onChangeFormData(e) } />
                    <input type='submit' value="Leave reply" className={classes.commentBtn} />
                </form>}

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
                    onChangeFormData={ onChangeFormData }
                    activeInputFieldID={ activeInputFieldID }
                    showHideEditField={ showHideEditField }
                    editComment={ editComment }
                    formData={ formData }
                    key={reply._id} 
                    defaultAvatar={ defaultAvatar }
                /> ) 
                : <h2>Loading...</h2> }
                
            </div>

            
        </div>
    );
}

export default SingleComment;