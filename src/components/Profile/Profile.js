import { useState } from 'react';

import classes from './Profile.module.css';

import { useAuth } from '../../context/AuthContext';


const Profile = () => {

    const { currentUser } = useAuth();
    const username = currentUser.email.split('@')[0];
    return (
        <div>
            <div className={classes.container}>
                <h1>{username}</h1>
                <div className={classes.innerContainer}>
                    <div className={classes.savedTexts}>
                        <h2>Saved Texts</h2>
                        <ul>

                        </ul>
                    </div>
                    <div className={classes.favTexts}>
                        <h2>Favorite Texts</h2>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile;
