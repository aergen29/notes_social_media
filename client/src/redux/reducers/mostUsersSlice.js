import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { decrypt } from "../../helpers/crypt";
import axios from "axios";
const {REACT_APP_API_URL} = process.env;

const initialState = {
  values:{
    users:[]
  },
  forFetch:{
    data:null,
    isLoading:false,
    error:null
  }
}

export const mostUsersFetch = createAsyncThunk("mostUsersSlice/mostUsersFetch",async (args,{getState,rejectWithValue})=>{
  try {
    const res = await axios.get(REACT_APP_API_URL + "/user/mostprofiles");
    const result = await res.data;
    const decryptedValue = decrypt(result.value);
    return decryptedValue;
  } catch (err) {
    return rejectWithValue(err.response);
  }
})

const mostUsersSlice = createSlice({
  name:"mostUsersSlice",
  initialState,
  reducers:{},
  extraReducers:builder=>{
    builder.addCase(mostUsersFetch.pending, state => {
      state.forFetch.isLoading = true;
      state.forFetch.error = null;
    })
    builder.addCase(mostUsersFetch.fulfilled, (state, action) => {
      state.forFetch.data = action.payload
      state.forFetch.error = null;
      state.forFetch.isLoading = false;
      state.values.users = action.payload.users
    })
    builder.addCase(mostUsersFetch.rejected, (state, action) => {
      state.forFetch.error = action.payload;
      state.forFetch.data = null;
      state.forFetch.isLoading = false;
    })
  }
})

export default mostUsersSlice.reducer;