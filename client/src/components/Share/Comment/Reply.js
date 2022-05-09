import { AiFillLike } from 'react-icons/ai';
import { RiDeleteBin2Line, RiEdit2Line } from 'react-icons/ri';
import { format } from 'date-fns';

import classes from '../Share.module.css';

const Reply = ({ formData, editComment, reply, allUserData, currentUser, deleteComment, likeComment, activeInputFieldID, onChangeFormData, showHideEditField }) => {
    
    let pic;
    let username;

    const matchIds = async() => {
        
        await allUserData.forEach(uData => {
            if(uData._id === reply.user) {
                pic = uData.avatar;
                username = uData.username;
            }
        });
    }

    matchIds();

    return (
        <div className={classes.singleReply}>

            <div className={classes.commentUser}>

                <div className={classes.commentUserInfo}>
                    {/* User Profile Picture  */}
                    <img src={ pic } alt="User profile pic" />
                    {/* Username */}
                    <p><strong>{ username }</strong></p>
                </div>

                {/* This will only be displayed if you are the person that left the comment */}
                {
                    currentUser && currentUser._id === reply.user ? 
                    <div className={classes.userActions}>
                        <button onClick={ () => showHideEditField(reply, 'edit') } className={classes.commentBtn}>{ <RiEdit2Line /> || 'Edit' }</button>
                        <button onClick={ () => deleteComment(reply._id) } className={classes.commentBtn}>{ <RiDeleteBin2Line /> || 'Delete'}</button>
                    </div> 
                    : null
                }

            </div>
            
            {/* Date */}
            <p>Posted: { format(new Date(reply.date), 'MM-dd-yy') }</p>

            {/* Comment/Edit */}
            {/* If activeInputFieldID = { id: reply._id, action: 'edit' } then show the edit field, else show the comment */}
            { activeInputFieldID.id === reply._id && activeInputFieldID.action === 'edit' ?
                <form className={classes.editForm} onSubmit={(e) => editComment(e, reply._id) }>
                    <input type='text' name="edit" required={ true } value={ formData.edit } onChange={ (e) => onChangeFormData(e) } />
                    <input type='submit' value="Submit" className={classes.commentBtn} />
                </form>
                : <p>{ reply.comment }</p>
            }        

            <div className={classes.commentActions}>
                {/* Like Comment  */}
                <button 
                onClick={ () => likeComment(reply._id) } 
                className={ classes.commentBtn }
                // disable comment if user already liked it
                disabled={ currentUser && reply.likes.includes(currentUser._id) }
                >
                    { <AiFillLike /> ||'Like'} { reply.likes.length }
                </button>
                
            </div>

        </div>
    );
}

export default Reply;