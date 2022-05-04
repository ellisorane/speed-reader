import { AiFillLike } from 'react-icons/ai';
import { RiDeleteBin2Line, RiEdit2Line } from 'react-icons/ri';
import { format } from 'date-fns';

import classes from '../Share.module.css';

const Reply = ({ reply, allUserData, currentUser, deleteComment, likeComment }) => {
    
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
                    {/* <img src={ userData.map(el => el._id === reply.user && el.avatar)  } alt="User Pic" /> */}
                    <img src={ pic } alt="User Pic" />
                    {/* <p><strong>{ userData.map(el => el._id === reply.user ? el.username : 'Anonymous user')  }</strong></p> */}
                    <p><strong>{ username }</strong></p>
                </div>

                {/* This will only show if you are the person that left the comment */}
                {
                    currentUser && currentUser._id === reply.user ? 
                    <div className={classes.userActions}>
                        <button className={classes.commentBtn}>{ <RiEdit2Line /> || 'Edit' }</button>
                        <button onClick={ () => deleteComment(reply._id) } className={classes.commentBtn}>{ <RiDeleteBin2Line /> || 'Delete'}</button>
                    </div> 
                    : null
                }

            </div>
            
            {/* Date */}
            <p>Posted: { format(new Date(reply.date), 'MM-dd-yy') }</p>


            {/* Comment */}
            <p>{ reply.comment }</p>

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