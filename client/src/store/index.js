import { configureStore } from '@reduxjs/toolkit';

import readingReducer from './reading';
import authReducer from './auth';

const store = configureStore({
    reducer: {
        reading: readingReducer,
        auth: authReducer
    }
})

export default store;