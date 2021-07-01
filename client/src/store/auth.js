import { createSlice } from '@reduxjs/toolkit';

const initialAuthState = {
    user: null,
    token: localStorage.getItem('token'),
    loading: true,
    loggedIn: false
}

const authSlice = createSlice({
    name: 'auth',
    initialState: initialAuthState,
    reducers: {
        loadUser(state, action) {
            state.loggedIn = true;
            state.loading = false;
            state.user = action.payload;
        },
        logInSignup(state, action) {
            localStorage.setItem('token', action.payload.token)
            state.loading = false;
            state.loggedIn = true;
            console.log(state.user);
        },
        
    }
})

export default authSlice.reducer;

export const authActions = authSlice.actions;
