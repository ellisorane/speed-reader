import { createSlice } from '@reduxjs/toolkit';

const initialAuthState = {
    token: localStorage.getItem('token'),
    user: null,
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
        authSuccess(state, action) {
            localStorage.setItem('token', action.payload.token)
            state.token = localStorage.getItem('token');
            state.loading = false;
            state.loggedIn = true;
        },
        noAuth(state) {
            localStorage.removeItem('token');
            state.user = null;
            state.token = null;
            state.loading = false;
            state.loggedIn = false;
        }
        
    }
})

export default authSlice.reducer;

export const authActions = authSlice.actions;
