import { useRef, useState } from 'react';


import classes from "../Auth.module.css";

import { useAuth } from '../../../context/AuthContext';


const Signup = () => {

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const emailRef = useRef();
    const { resetPassword } = useAuth();


    const loginHandler = async (e) => {
        e.preventDefault();
        
        try {
            setMessage('');
            setError('');
            setLoading(true);
            await resetPassword(emailRef.current.value);
            setMessage('Check your email for password reset');
        } catch {
            setError('Failed to reset password');
        }

        setLoading(false);
    }

    return (
        <div>
            <div className={classes.container}>
                <div className={classes.border}>
                    <h1>Forgot Password</h1>
                    {error && <h3 className={classes.error}>{error}</h3>}
                    {message && <h3 className={classes.message}>{message}</h3>}
                    <form onSubmit={loginHandler}>
                        <label htmlFor="">Email</label> <br />
                        <input type="email" name="email" id="" ref={emailRef} /> <br /> <br />
                        <button type="submit" className={classes.btn} disabled={loading}>Reset Password</button> 
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup;
