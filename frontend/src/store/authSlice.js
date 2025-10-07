// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { getProfile } from '../services/admin.services';
// import { getClientProfile } from '../services/client.services';

// // Initialize Redux state from sessionStorage
// const storedUser = typeof window !== 'undefined' && sessionStorage.getItem('crm_user');
// const parsedUser = storedUser ? JSON.parse(storedUser) : null;

// const initialState = {
//   user: parsedUser,
//   isAuthenticated: !!parsedUser,
//   status: 'idle',
//   error: null,
// };

// // Async thunk to fetch profile based on role
// export const fetchUserProfile = createAsyncThunk(
//   'auth/fetchUserProfile',
//   async (role) => {
//     let data;
//     if (role === 'client') {
//       data = await getClientProfile();
//     } else {
//       data = await getProfile();
//     }
//     return { ...data, role };
//   }
// );

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     loginSuccess: (state, action) => {
//       state.user = action.payload;
//       state.isAuthenticated = true;
//       if (typeof window !== 'undefined') {
//         sessionStorage.setItem('crm_user', JSON.stringify(action.payload));
//       }
//     },
//     logout: (state) => {
//       state.user = null;
//       state.isAuthenticated = false;
//       state.status = 'idle';
//       state.error = null;
//       if (typeof window !== 'undefined') {
//         sessionStorage.removeItem('crm_user');
//       }
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchUserProfile.pending, (state) => {
//         state.status = 'loading';
//         state.error = null;
//       })
//       .addCase(fetchUserProfile.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.user = action.payload;
//         state.isAuthenticated = true;
//         if (typeof window !== 'undefined') {
//           sessionStorage.setItem('crm_user', JSON.stringify(action.payload));
//         }
//       })
//       .addCase(fetchUserProfile.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.error.message;
//         state.user = null;
//         state.isAuthenticated = false;
//         if (typeof window !== 'undefined') {
//           sessionStorage.removeItem('crm_user');
//         }
//       });
//   },
// });

// export const { loginSuccess, logout } = authSlice.actions;
// export default authSlice.reducer;

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