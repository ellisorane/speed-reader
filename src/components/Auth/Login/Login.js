import { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

import classes from "../Auth.module.css";

import { useAuth } from '../../../context/AuthContext';


const Signup = () => {

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const emailRef = useRef();
    const passwordRef = useRef();
    const { login } = useAuth();
    const history = useHistory();


    const loginHandler = async (e) => {
        e.preventDefault();
        
        try {
            setError('');
            setLoading(true);
            await login(emailRef.current.value, passwordRef.current.value);
            history.push('/');
        } catch {
            setError('Failed to sign in');
        }

        setLoading(false);
    }

    return (
        <div>
            <div className={classes.container}>
                <h1>Login</h1>
                {error && <h3 className={classes.error}>{error}</h3>}
                <form onSubmit={loginHandler}>
                    <label htmlFor="">Email</label> <br />
                    <input type="email" name="email" id="" ref={emailRef} /> <br />
                    <label htmlFor="">Password</label> <br />
                    <input type="password" name="password" id="" ref={passwordRef} /> <br />
                    <button type="submit" className={classes.btn} disabled={loading}>Login</button> 
                    <p>Don't have an account?</p>
                    <a href="/signup">Signup</a>
                </form>
            </div>
        </div>
    )
}

export default Signup;
