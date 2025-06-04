import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './tasksSlice';
import moodReducer from './moodSlice';

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    mood: moodReducer,
  },
});

export default store;
