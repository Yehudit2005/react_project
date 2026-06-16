import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Message } from '../Models/message.model';

const initialState: Message = {
  text: '',
  type: null
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setMessage: (state, action: PayloadAction<Message>) => {
      state.text = action.payload.text;
      state.type = action.payload.type;
    },
    clearMessage: (state) => {
      state.text = '';
      state.type = null;
    }
  }
});

export const { setMessage, clearMessage } = messageSlice.actions;
export default messageSlice.reducer;