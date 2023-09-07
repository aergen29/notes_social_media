import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { decrypt, encrypt } from '../../helpers/crypt';
import axios from 'axios';
const { REACT_APP_API_URL } = process.env;

const initialState = {
  follow: {
    data: null,
    error: null,
    isLoading: false
  },
  unFollow: {
    data: null,
    error: null,
    isLoading: false
  }
}

export const followFetch = createAsyncThunk('followSlice/followFetch', async (args, { getState, rejectWithValue }) => {
  const { username } = args;
  const token = getState().session.token;
  if (!token) throw new Error();
  const cryptedValue = encrypt({ username });
  try {
    const res = await axios.post(REACT_APP_API_URL + '/relationship/follow', { value: cryptedValue }, {
      headers: {
        Authorization: 'Bearer: ' + token
      }
    });
    const result = await res.data;
    const decryptedValue = decrypt(result.value);
    return decryptedValue;
  } catch (err) {
    return rejectWithValue(err.response);
  }
})


export const unfollowFetch = createAsyncThunk('followSlice/unfollowFetch', async (args, { getState, rejectWithValue }) => {
  const { username } = args;
  const token = getState().session.token;
  if (!token) throw new Error();
  const cryptedValue = encrypt({ username });
  try {
    const res = await axios.post(REACT_APP_API_URL + '/relationship/unfollow', { value: cryptedValue }, {
      headers: {
        Authorization: 'Bearer: ' + token
      }
    });
    const result = await res.data;
    const decryptedValue = decrypt(result.value);
    return decryptedValue;
  } catch (err) {
    return rejectWithValue(err.response);
  }
})

const followSlice = createSlice({
  name: 'followSlice',
  initialState,
  reducers: {
    resetFollowState: () => {
      return { ...initialState };
    }
  },
  extraReducers: builder => {
    builder.addCase(followFetch.pending, state => {
      state.follow.isLoading = true;
      state.follow.error = null;
    })
    builder.addCase(followFetch.fulfilled, (state, action) => {
      state.follow.data = action.payload
      state.follow.error = null;
      state.follow.isLoading = false;
    })
    builder.addCase(followFetch.rejected, (state, action) => {
      state.follow.error = action.payload;
      state.follow.data = null;
      state.follow.isLoading = false;
    })
    builder.addCase(unfollowFetch.pending, state => {
      state.unFollow.isLoading = true;
      state.unFollow.error = null;
    })
    builder.addCase(unfollowFetch.fulfilled, (state, action) => {
      state.unFollow.data = action.payload
      state.unFollow.error = null;
      state.unFollow.isLoading = false;
    })
    builder.addCase(unfollowFetch.rejected, (state, action) => {
      state.unFollow.error = action.payload;
      state.unFollow.data = null;
      state.unFollow.isLoading = false;
    })
  }
})

export const { resetFollowState } = followSlice.actions;

export default followSlice.reducer;