import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { NavLink } from "react-router-dom";
import axios from 'axios';

import { authActions } from '../../../store/auth';
    
import classes from "../Auth.module.css";


const Signup = ({ loadUser }) => {

    const [error, setError] = useState('');
    const loading = useSelector(state => state.auth.loading);
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        passwordConfirm: ''
    });
    const { email, username, password, passwordConfirm } = formData;

    const dispatch = useDispatch();
    const history = useHistory();
    
    const dataOnChangeHandler = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const signupHandler = async (e) => {
        e.preventDefault();

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const body = JSON.stringify({ email, username, password });
        
        if (password !== passwordConfirm) {
            return setError("Passwords don't match");
        }
        
        try {
            setError('');
            const res = await axios.post('/api/user', body, config);
            dispatch(authActions.authSuccess(res.data));

            loadUser();

            history.push('/profile');

        } catch(err) {
            const errors = err.response.data.errors;

            console.error(errors[0].msg);
            setError(errors[0].msg);
        }

    }


    return (
            <div>
                <div className={classes.container}>
                    <div className={classes.border}>
                        <h1>Signup</h1>
                        {error && <h3 className={classes.error}>{error}</h3>}
                        <form onSubmit={signupHandler}>
                            <label htmlFor="">Username</label> <br />
                            <input type="text" name="username" onChange={e => dataOnChangeHandler(e)} required /> <br />
                            <label htmlFor="">Email</label> <br />
                            <input type="email" name="email" onChange={e => dataOnChangeHandler(e)} required /> <br />
                            <label htmlFor="">Password</label> <br />
                            <input type="password" name="password" onChange={e => dataOnChangeHandler(e)} required /> <br />
                            <label htmlFor="">Confirm Password</label> <br />
                            <input type="password" name="passwordConfirm" onChange={e => dataOnChangeHandler(e)} required /> <br />
                            <button type="submit" className={classes.btn}>Signup</button> 
                            <p><NavLink to="/login">Already have an account?</NavLink></p>
                        </form>
                    </div>
                </div>
            </div>
    )
}

export default Signup;
