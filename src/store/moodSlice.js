import { createSlice } from '@reduxjs/toolkit';

const moodSlice = createSlice({
  name: 'mood',
  initialState: [],
  reducers: {
    addMoodEntry: (state, action) => {
      state.push(action.payload);
    },
  },
});

export const { addMoodEntry } = moodSlice.actions;
export default moodSlice.reducer;
