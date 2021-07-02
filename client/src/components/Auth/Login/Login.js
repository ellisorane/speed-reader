import axios from 'axios';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
// import { useHistory } from 'react-router-dom';
import { NavLink } from "react-router-dom";

import { authActions } from '../../../store/auth';

import classes from "../Auth.module.css";


const Login = ({ loadUser }) => {

    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const { email, password } = formData;

    const dispatch = useDispatch();

    const dataOnChangeHandler = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const loginHandler = async (e) => {
        e.preventDefault();

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const body = JSON.stringify({ email, password });
        
        try {
            setError('');

            const res = await axios.post('/api/auth', body, config);
            dispatch(authActions.authSuccess(res.data));
            loadUser();
            // history.push('/');
        } catch {
            setError('Failed to sign in');
        }

    }

    return (
        <div>
            <div className={classes.container}>
                <div className={classes.border}>
                    <h1>Login</h1>
                    {error && <h3 className={classes.error}>{error}</h3>}
                    <form onSubmit={loginHandler}>
                        <label htmlFor="">Email</label> <br />
                        <input type="email" name="email" onChange={e => dataOnChangeHandler(e)} required /> <br />
                        <label htmlFor="">Password</label> <br />
                        <input type="password" name="password" onChange={e => dataOnChangeHandler(e)} required /> <br />
                        <label htmlFor="">Confirm Password</label> <br />
                        <button type="submit" className={classes.btn}>Login</button> 
                        <p><NavLink to="/forgot_password">Forgot password?</NavLink> </p>
                        <p><NavLink to="/signup">Don't have an account?</NavLink></p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;
