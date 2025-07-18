// store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const storedUser = typeof window !== 'undefined' && localStorage.getItem('crm_user');
const parsedUser = storedUser ? JSON.parse(storedUser) : null;

const initialState = {
  user: parsedUser,
  isAuthenticated: !!parsedUser,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;

      // Cleanup storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('crm_user');
        localStorage.removeItem('adminToken');
      }
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;




