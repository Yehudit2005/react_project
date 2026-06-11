import { createSlice } from '@reduxjs/toolkit';
import type { User } from '../Models/user.model';

const userSlice = createSlice({
  name: 'user',
  initialState: {
currentUser: null as User | null,
    instructor: false
  },
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;
    },
    // isInstructor: (state, action) => {
    //   state.instructor = action.payload;
    // }
  }
});

export const { setUser} = userSlice.actions;
export default userSlice.reducer;