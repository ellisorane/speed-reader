import { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { NavLink } from "react-router-dom";


import classes from "../Auth.module.css";


const Signup = () => {

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const emailRef = useRef();
    const passwordRef = useRef();
    const history = useHistory();


    const loginHandler = async (e) => {
        e.preventDefault();
        
        try {
            setError('');
            setLoading(true);
            // await login(emailRef.current.value, passwordRef.current.value);
            // setLoggedIn(true);
            history.push('/');
        } catch {
            setError('Failed to sign in');
        }

        setLoading(false);
    }

    return (
        <div>
            <div className={classes.container}>
                <div className={classes.border}>
                    <h1>Login</h1>
                    {error && <h3 className={classes.error}>{error}</h3>}
                    <form onSubmit={loginHandler}>
                        <label htmlFor="">Email</label> <br />
                        <input type="email" name="email" ref={emailRef} required /> <br />
                        <label htmlFor="">Password</label> <br />
                        <input type="password" name="password" ref={passwordRef} required /> <br />
                        <button type="submit" className={classes.btn} disabled={loading}>Login</button> 
                        <p><NavLink to="/forgot_password">Forgot password?</NavLink> </p>
                        <p><NavLink to="/signup">Don't have an account?</NavLink></p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup;
