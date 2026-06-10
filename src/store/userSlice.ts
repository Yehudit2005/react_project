import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null as any,
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