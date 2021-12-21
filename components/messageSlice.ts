import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Message {
  value: string;
  timestamp: Date;
}

export interface MessageState {
  messages: Message[];
}

const initialState: MessageState = {
  messages: [],
};

export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    message: (state, action: PayloadAction<Message>) => {
      state.messages.unshift(action.payload);
    },
  },
});

export const { message } = messageSlice.actions;

export default messageSlice.reducer;
