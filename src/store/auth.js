import { createSlice } from '@reduxjs/toolkit';

const initialAuthState = {
    loggedIn: false
}

const authSlice = createSlice({
    name: 'auth',
    initialState: initialAuthState,
    reducers: {
        logoIn(state) {
            state.loggedIn = true;
        }
    }
})

export default authSlice.reducer;

export const authActions = authSlice.actions;
