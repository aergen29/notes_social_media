import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from 'universal-cookie';
import { decrypt, encrypt } from "../../helpers/crypt";
const cookies = new Cookies();
const { REACT_APP_API_URL } = process.env;

const initialState = {
  data:null,
  error:null,
  isLoading:false
}


export const refreshTokenFetch = createAsyncThunk('sessionSlice/refreshTokenFetch', async (args, { getState, rejectWithValue }) => {
  const refreshToken = cookies.get('access');
  const accessToken = getState().session.token;
  const cryptedValue = encrypt({ token: refreshToken });
  if(!refreshToken) throw new Error();

  try {
    const res = await axios.post(REACT_APP_API_URL + "/auth/refresh", { value: cryptedValue });
    const result = await res.data;
    const decryptedValue = decrypt(result.value);
    return decryptedValue;
  } catch (err) {
    return rejectWithValue(err.response);
  }
})


const refreshTokenSlice = createSlice({
  name:'refreshTokenSlice',
  initialState,
  reducers:{},
  extraReducers: builder => {
    builder.addCase(refreshTokenFetch.pending, state => {
      state.isLoading = true;
      state.error = null;
    })
    builder.addCase(refreshTokenFetch.fulfilled, (state, action) => {
      state.data = action.payload;
      state.error = null;
      state.isLoading = false;
    })
    builder.addCase(refreshTokenFetch.rejected, (state, action) => {
      console.log(action.payload);
      cookies.remove('access');
      state.error = action.payload;
      state.data = null;
      state.isLoading = false;
    })
  }
})


export default refreshTokenSlice.reducer;