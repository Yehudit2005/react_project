import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../Models/user.model';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null as User | null,
    instructor: false,
    isAdmin: false 
  },
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setAdmin: (state, action: PayloadAction<boolean>) => { 
      state.isAdmin = action.payload;
    }
  }
});

export const { setUser, setAdmin } = userSlice.actions; 
export default userSlice.reducer;