import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { decrypt, encrypt } from '../../helpers/crypt';
import axios from 'axios';
const {REACT_APP_API_URL} = process.env;

const initialState = {
  values: {
    serchingUser: ''
  },
  forFetch: {
    data: null,
    error: null,
    isLoading: false
  }
}

export const visitFetch = createAsyncThunk('visitSlice/visitFetch', async (args, { getState, rejectWithValue }) => {
  const state = getState().visit.values;

  const cryptedValue = encrypt({username:state.serchingUser});

  try {
    const res = await axios.post(REACT_APP_API_URL+"/user/visit", { value: cryptedValue});
    const result = await res.data;
    const decryptedValue = decrypt(result.value);
    return decryptedValue;
  } catch (err) {
    return rejectWithValue(err.response);
  }

})

const visitSlice = createSlice({
  name: 'visitSlice',
  initialState,
  reducers: {
    setVisitState: (state, action) => {
      const username = action.payload;
      return {
        ...state,
        values: {
          ...state.values,
          serchingUser: username
        }
      }
    }
  },
  extraReducers: builder => {
    builder.addCase(visitFetch.pending, state => {
      state.forFetch.isLoading = true;
      state.forFetch.error = null;
    })
    builder.addCase(visitFetch.fulfilled, (state, action) => {
      state.forFetch.data = action.payload
      state.forFetch.error = null;
      state.forFetch.isLoading = false;
    })
    builder.addCase(visitFetch.rejected, (state, action) => {
      state.forFetch.error = action.payload;
      state.forFetch.data = null;
      state.forFetch.isLoading = false;
    })
  }
})

export const { setVisitState } = visitSlice.actions;

export default visitSlice.reducer;