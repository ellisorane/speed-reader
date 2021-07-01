import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from "react-router-dom";
import axios from 'axios';

import { authActions } from '../../../store/auth';
import setAuthToken from '../../../utils/setAuthToken';

    
import classes from "../Auth.module.css";


const Signup = () => {

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        passwordConfirm: ''
    })
    const dispatch = useDispatch();

    const { email, password, passwordConfirm } = formData;
    
    const dataOnChangeHandler = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const signupHandler = async (e) => {
        e.preventDefault();

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const body = JSON.stringify({ email, password });
        
        if (password !== passwordConfirm) {
            return setError("Passwords don't match");
        }
        
        try {
            console.log([email, password, passwordConfirm])
            setError('');
            setMessage('');
            setLoading(true);
            const res = await axios.post('/api/user', body, config);
            dispatch(authActions.logInSignup(res.data));

            // Load user 
            const loadUser = async() => {
                if (localStorage.token) {
                    setAuthToken(localStorage.token);
                }
                try {
                    const res = await axios.get('/api/auth');
                    dispatch(authActions.loadUser(res.data));
                } catch (error) {
                    // dispatch({ type: AUTH_ERROR });
                    console.log('Failed to load user');
                }
            }

            setMessage('Account successfully created');

        } catch(err) {
            const errors = err.response.data.errors;

            if (errors) {
                console.error(errors);
            }
            setError('Failed to create account');
        }

        setLoading(false);
    }


    return (
            <div>
                <div className={classes.container}>
                    <div className={classes.border}>
                        {/* <button onClick={signupHandler}>Test Button</button> */}
                        <h1>Signup</h1>
                        {error && <h3 className={classes.error}>{error}</h3>}
                        {message && <h3 className={classes.message}>{message}</h3>}
                        <form onSubmit={signupHandler}>
                            <label htmlFor="">Email</label> <br />
                            <input type="email" name="email" onChange={e => dataOnChangeHandler(e)} required /> <br />
                            <label htmlFor="">Password</label> <br />
                            <input type="password" name="password" onChange={e => dataOnChangeHandler(e)} required /> <br />
                            <label htmlFor="">Confirm Password</label> <br />
                            <input type="password" name="passwordConfirm" onChange={e => dataOnChangeHandler(e)} required /> <br />
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
