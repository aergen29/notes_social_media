import { createSlice } from "@reduxjs/toolkit";
import Cookies from 'universal-cookie';

const initialState = {
  _id: '',
  name: '',
  username: '',
  email: '',
  password: '',
  hidden: false,
  blocked: false,
  profile_image: '',
  createdAt: '',
  saved: [],
  follower: [],
  follow: [],
  token: '',
  isLoading: true
}



const sessionSlice = createSlice({
  name: "sessionSlice",
  initialState,
  reducers: {
    setSessionState: (state, action) => {
      return { ...action.payload.user, token: action.payload.token };
    },
    setSessionOneThing: (state, action) => {
      const { name, value } = action.payload;
      return { ...state, [name]: value };

    }
  }
})

export const { setSessionState, setSessionOneThing } = sessionSlice.actions;
export default sessionSlice.reducer;