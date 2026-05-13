import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import taskService from './taskService';

const initialState = {
  tasks: [],
  stats: null,
  pagination: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
  filters: {
    search: '',
    status: '',
    priority: '',
    sortBy: '',
    sortOrder: 'desc',
    page: 1,
  },
};

// Get tasks
export const getTasks = createAsyncThunk('tasks/getAll', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const filters = thunkAPI.getState().tasks.filters;
    // Only send non-empty filters
    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== null) params[key] = value;
    });
    return await taskService.getTasks(token, params);
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// Create task
export const createTask = createAsyncThunk('tasks/create', async (taskData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await taskService.createTask(token, taskData);
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// Update task
export const updateTask = createAsyncThunk('tasks/update', async ({ taskId, taskData }, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await taskService.updateTask(token, taskId, taskData);
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// Delete task
export const deleteTask = createAsyncThunk('tasks/delete', async (taskId, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await taskService.deleteTask(token, taskId);
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// Get task stats
export const getTaskStats = createAsyncThunk('tasks/stats', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await taskService.getTaskStats(token);
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    resetTaskState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get tasks
      .addCase(getTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create task
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks.unshift(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update task
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isSuccess = true;
        const index = state.tasks.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      })
      // Delete task
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.tasks = state.tasks.filter((t) => t._id !== action.payload._id);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      })
      // Stats
      .addCase(getTaskStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const { resetTaskState, setFilters, resetFilters } = taskSlice.actions;
export default taskSlice.reducer;
