import { createSlice } from '@reduxjs/toolkit';

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: [],
  reducers: {
    addTask: (state, action) => {
      state.push(action.payload);
    },
    removeTask: (state, action) => {
      return state.filter(task => task.id !== action.payload);
    },
    toggleTask: (state, action) => {
      const task = state.find(t => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
    startTask: (state, action) => {
      const task = state.find(t => t.id === action.payload);
      if (task && !task.startedAt) {
        task.startedAt = Date.now();
      }
    },
    stopTask: (state, action) => {
      const task = state.find(t => t.id === action.payload);
      if (task && task.startedAt) {
        const duration = Date.now() - task.startedAt;
        task.timeSpent = (task.timeSpent || 0) + duration;
        task.startedAt = null;
      }
    },
  },
});

export const { addTask, removeTask, toggleTask, startTask, stopTask } =
  tasksSlice.actions;
export default tasksSlice.reducer;
