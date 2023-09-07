import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import axios from "axios";
import { decrypt, encrypt } from "../../helpers/crypt";
const { REACT_APP_API_URL } = process.env;

const initialState = {
  values: {
    users: null,
    username: ''
  },
  forFetch: {
    data: null,
    error: null,
    isLoading: false
  }
}

export const searchFetch = createAsyncThunk('searchSlice/searchFetch', async (args, { getState, rejectWithValue }) => {
  const state = getState().search;
  const token = getState().session.token;

  const value = { ...state.values };
  const cryptedValue = encrypt({ username: value.username });

  try {
    const res = await axios.post(REACT_APP_API_URL + "/user/search", { value: cryptedValue },{
      headers:{
        'Authorization': 'Bearer: ' + token
      }
    });
    const result = await res.data;
    const decryptedValue = decrypt(result.value);
    return decryptedValue;
  } catch (err) {
    return rejectWithValue(err.response);
  }
})

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchValues:(state,action)=>{
      state = current(state);
      const username = action.payload;
      return{
        ...state,
        values:{
          ...state.values,
          username
        }
      }
    },
    resetSearchValues:(state,action)=>{
      state = current(state);
      return{
        ...state,
        values:{
          users:null,
          username:''
        }
      }
    }
  },
  extraReducers: builder => {
    builder.addCase(searchFetch.pending, state => {
      state.forFetch.isLoading = true;
      state.forFetch.error = null;
    })
    builder.addCase(searchFetch.fulfilled, (state, action) => {
      state.forFetch.data = action.payload
      state.forFetch.error = null;
      state.forFetch.isLoading = false;
      state.values.users = action.payload.users;
    })
    builder.addCase(searchFetch.rejected, (state, action) => {
      state.forFetch.error = action.payload;
      state.forFetch.data = null;
      state.forFetch.isLoading = false;
    })
  }
})

export const {setSearchValues,resetSearchValues} = searchSlice.actions;
export default searchSlice.reducer;