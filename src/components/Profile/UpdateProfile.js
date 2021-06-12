import { useState, useRef, useEffect } from 'react';
import { NavLink } from "react-router-dom";

import { useAuth } from '../../context/AuthContext';

import classes from './Profile.module.css';


const UpdateProfile = () => {
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { currentUser, updateEmail, updatePassword } = useAuth();


    const updateUserHandler = (e) => {
        e.preventDefault();
        
        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Passwords don't match");
        }

        const promises = [];
        setLoading(true);
        setError('');
        setMessage('');


        //if new email is different from old email, push updateEmail to promises
        if (emailRef.current.value !== currentUser.email) {
            promises.push(updateEmail(emailRef.current.value));
        }
        //if there is a password value, push updatePassword to promises
        if (passwordRef.current.value) {
                promises.push(updatePassword(passwordRef.current.value));
        }

        Promise.all(promises).then(() => {
            setMessage('Profile successfully updated');
        }).catch(() => {
            setError('Failed to update profile');
        }).finally(() => {
            setLoading(false);
        });
        
    }


    return (
            <div>
                <div className={classes.container}>
                    <div className={classes.border}>
                        <h1>Update Profile</h1>
                        {error && <h3 className={classes.error}>{error}</h3>}
                        {message && <h3 className={classes.message}>{message}</h3>}
                        <form onSubmit={updateUserHandler}>
                            <label htmlFor="">Email</label> <br />
                            <input type="email" name="email" id="" ref={emailRef} defaultValue={currentUser.email}required /> <br />
                            <label htmlFor="">Password</label> <br />
                            <input type="password" name="password" id="" ref={passwordRef} placeholder="Optional" /> <br />
                            <label htmlFor="">Confirm Password</label> <br />
                            <input type="password" name="confirm_password" id="" ref={passwordConfirmRef} /> <br />
                            <button type="submit" className={classes.btn} disabled={loading}>Update</button> 
                        </form>
                    </div>
                </div>
            </div>
        // </AuthProvider>
    )
}

export default UpdateProfile;