import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { decrypt, encrypt } from '../../helpers/crypt';
import axios from 'axios';
const { REACT_APP_API_URL } = process.env;


const initialState = {
  data: null,
  error: null,
  isLoading:false
}

export const likeFetch = createAsyncThunk('likeSlice/likeFetch', async (args, { getState, rejectWithValue }) => {
  const { id, liked } = args;
  const token = getState().session.token;
  if (!token) throw new Error();
  const cryptedValue = encrypt({ id });
  try {
    const res = await liked ?
      axios.post(REACT_APP_API_URL + '/relationship/unlike', { value: cryptedValue }, {
        headers: {
          'Authorization': 'Bearer: ' + token,
        }
      }) :
      axios.post(REACT_APP_API_URL + '/relationship/like', { value: cryptedValue }, {
        headers: {
          'Authorization': 'Bearer: ' + token,
        }
      });



    const result = await res;
    const decryptedValue = decrypt(result.data.value);
    return decryptedValue;
  } catch (err) {
    return rejectWithValue(err);
  }
})

const likeSlice = createSlice({
  name: 'likeSlice',
  initialState,
  reducers: {
    resetLikeState: () => {
      return { ...initialState }
    }
  },
  extraReducers: builder => {
    builder.addCase(likeFetch.pending, state => {
      state.data = null;
      state.error = null;
      state.isLoading = true;
    })
    builder.addCase(likeFetch.fulfilled, (state,action) => {
      state.data = action.payload;
      state.error = null;
      state.isLoading = true;
    })
    builder.addCase(likeFetch.rejected, (state,action) => {
      state.data = null;
      state.error = action.payload;
      state.isLoading = true;
    })
  }
})

export const {resetLikeState} = likeSlice.actions;
export default likeSlice.reducer;