import { useRef, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
    
import classes from "../Auth.module.css";

import { useAuth } from '../../../context/AuthContext';

const Signup = () => {

    const [error, setError] = useState('');
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
            setLoading(true);
            await signup(emailRef.current.value, passwordRef.current.value);
        } catch {
            setError('Failed to create account');
        }

        setLoading(false);
    }


    return (
            <div>
                <div className={classes.container}>
                    {/* <button onClick={createUserHandler}>Test Button</button> */}
                    <h1>Signup</h1>
                    {error && <h3 className={classes.error}>{error}</h3>}
                    <form onSubmit={createUserHandler}>
                        <label htmlFor="">Email</label> <br />
                        <input type="email" name="email" id="" ref={emailRef} /> <br />
                        <label htmlFor="">Password</label> <br />
                        <input type="password" name="password" id="" ref={passwordRef} /> <br />
                        <label htmlFor="">Confirm Password</label> <br />
                        <input type="password" name="confirm_password" id="" ref={passwordConfirmRef} /> <br />
                        <button type="submit" className={classes.btn} disabled={loading}>Signup</button> 
                        <p>Already have an account?</p>
                        <a href="/login">Login</a>
                    </form>
                </div>
            </div>
        // </AuthProvider>
    )
}

export default Signup;
