import axios from 'axios';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { NavLink } from "react-router-dom";

import Spinner from '../Spinner/Spinner';
import { textsActions } from '../../store/texts';
import { authActions } from '../../store/auth';
import { readingActions } from '../../store/reading';

import classes from './Profile.module.css';

const Profile = ({ defaultAvatar, loadUser }) => {

    const user = useSelector(state => state.auth.user);
    const loading = useSelector(state => state.auth.loading);
    const loadingTexts = useSelector(state => state.texts.loadingTexts);
    const savedTexts = useSelector(state => state.texts.savedTexts);
    const [showHide, setShowHide] = useState(false);

    const [avatar, setAvatar] = useState();
    
    const dispatch = useDispatch();
    const history = useHistory();

    const getSavedTextsHandler = async () => {
        try {
            const res = await axios.get('/api/texts');
            
            dispatch(textsActions.getSavedTexts(res.data));
        } catch (err) {
            console.error(err);
        }
    }

    const deleteTextHandler = async (id) => {
        try {
            await axios.delete(`/api/texts/${id}`);
            getSavedTextsHandler();
        } catch (err) {
            console.error(err);
        }
    }

    const readTextHandler = async (id) => {
        try {
            const res = await axios.get(`/api/texts/${id}`);
            
            dispatch(readingActions.addText(res.data));
            history.push('/');

        } catch (err) {
            console.error(err);
        }
    }

    const deleteAccountHandler = async (userId) => {
        const deletePrompt = prompt("Are you sure you want to delete your account? Type \"Delete\" into the text area to confirm.");

        if (deletePrompt === 'Delete') {
            try {
                await axios.delete(`/api/user/${userId}`);
                dispatch(authActions.noAuth());
                dispatch(readingActions.clearAllText());
                history.push('/');
                alert("Account successfully deleted");
            } catch (err) {
                console.error(err);
            }
        }
    }


    const changeAvFile = (e) => {
        setAvatar(e.target.files[0]);
    }

    const submitAvatar = async(e) => {
        // e.preventDefault();
        setShowHide(false);
        const data = new FormData();
        data.append("avatar", avatar);

        try {
            const res = await axios.post('/api/user/avatar', data);
            // Load updated user
            loadUser();
        } catch(err) {
            console.log(err);
        }

    }

    useEffect(() => {
        !loading && getSavedTextsHandler();
    }, [loading]);
    
    

    if (!loading && user) {
        return (
            <div>
                <div className={classes.container}>
                    {/* Display Profile Picture  */}
                    { user && 
                    <img className={classes.userPhoto} 
                        src={ `/uploads/${user.avatar}` } 
                        alt="User profile pic" 
                        onError={ (e) => defaultAvatar(e)  }
                    /> }

                    {/* Upload user photo - Disabled until I figure out how to make it work on the live website */}
                    <button className={classes.btn} onClick={ () => setShowHide(!showHide) }>Change Profile pic</button>
                    { 
                        showHide &&
                        <form onSubmit={ (e) => submitAvatar(e) }>
                            <input type='file' className={classes.uploadAvatar} name='avatar' onChange={ (e) => changeAvFile(e) } accept="images/*" />
                            <input type="submit" />
                        </form>
                    }
                    {/* Username  */}
                    <h1>{ user.username }</h1>
                    <button className={classes.deleteBtn} onClick={() => deleteAccountHandler(user._id)}>Delete Account</button>
                    <div className={classes.savedTexts}>
                        <h2><u>Saved Texts</u></h2>
                        {!loadingTexts ?
                            savedTexts.map(text => 
                                <div className={classes.btnContainer} key={text._id}>
                                    <h3 className={classes.btn} onClick={() => readTextHandler(text._id)}>{text.title}</h3>
                                    <button className={classes.deleteBtn} onClick={() => deleteTextHandler(text._id)}>x</button>
                                </div>
                            )
                            : <Spinner />}
                    </div>
                </div>
            </div>
        );
    } else {
        return <Spinner />;
    }
}

export default Profile;
