import { createSlice } from '@reduxjs/toolkit';

interface User {
  access: string;
  refresh: string;
}

type UserState = User | null;

const initialState: UserState = null;

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => action.payload,
    clearUser: () => null,
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;