import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  business: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.business = action.payload.business || null;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.business = null;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;

// Selector
export const selectCurrentUser = (state) => state.auth.user;

export const selectCurrentToken = (state) => state.auth.token;

export const selectCurrentBusiness = (state) => state.auth.business;
