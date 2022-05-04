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

const Profile = () => {

    const user = useSelector(state => state.auth.user);
    const loading = useSelector(state => state.auth.loading);
    const loadingTexts = useSelector(state => state.texts.loadingTexts);
    const savedTexts = useSelector(state => state.texts.savedTexts);

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

    useEffect(() => {
        !loading && getSavedTextsHandler();
    }, [loading]);

    if (!loading && user) {
        return (
            <div>
                <div className={classes.container}>
                    {/* Username  */}
                    <h1>{ user.username }</h1>
                    <button className={classes.deleteBtn} onClick={() => deleteAccountHandler(user._id)}>Delete Account</button>
                    <div className={classes.savedTexts}>
                        <h2>Saved Texts</h2>
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
