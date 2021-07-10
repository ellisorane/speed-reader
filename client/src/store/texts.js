import { createSlice } from '@reduxjs/toolkit';

const initialReadingState = {
    savedTexts: null,
    loadingTexts: true
}

const textsSlice = createSlice({
    name: 'texts',
    initialState: initialReadingState,
    reducers: {
        getSavedTexts(state, action) {
            state.savedTexts = action.payload;
            state.loadingTexts = false;
        }
    }
});

export default textsSlice.reducer;

export const textsActions = textsSlice.actions;