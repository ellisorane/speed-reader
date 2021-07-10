import { configureStore } from '@reduxjs/toolkit';

import readingReducer from './reading';
import authReducer from './auth';
import textsReducer from './texts';

const store = configureStore({
    reducer: {
        reading: readingReducer,
        auth: authReducer,
        texts: textsReducer
    }
})

export default store;