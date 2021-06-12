import { useRef, useState } from 'react';
import { NavLink } from "react-router-dom";
// import { useDispatch, useSelector } from 'react-redux';
    
import classes from "../Auth.module.css";

import { useAuth } from '../../../context/AuthContext';

const Signup = () => {

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { signup } = useAuth();


    const createUserHandler = async (e) => {
        e.preventDefault();
        
        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Passwords don't match");
        }
        
        try {
            setError('');
            setMessage('');
            setLoading(true);
            await signup(emailRef.current.value, passwordRef.current.value);
            setMessage('Account successfully created');

        } catch {
            setError('Failed to create account');
        }

        setLoading(false);
    }


    return (
            <div>
                <div className={classes.container}>
                    <div className={classes.border}>
                        {/* <button onClick={createUserHandler}>Test Button</button> */}
                        <h1>Signup</h1>
                        {error && <h3 className={classes.error}>{error}</h3>}
                        {message && <h3 className={classes.message}>{message}</h3>}
                        <form onSubmit={createUserHandler}>
                            <label htmlFor="">Email</label> <br />
                            <input type="email" name="email" id="" ref={emailRef} required /> <br />
                            <label htmlFor="">Password</label> <br />
                            <input type="password" name="password" id="" ref={passwordRef} required /> <br />
                            <label htmlFor="">Confirm Password</label> <br />
                            <input type="password" name="confirm_password" id="" ref={passwordConfirmRef} required /> <br />
                            <button type="submit" className={classes.btn} disabled={loading}>Signup</button> 
                            <p><NavLink to="/login">Already have an account?</NavLink></p>
                        </form>
                    </div>
                </div>
            </div>
        // </AuthProvider>
    )
}

export default Signup;
