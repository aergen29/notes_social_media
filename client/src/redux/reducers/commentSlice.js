import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { decrypt, encrypt } from '../../helpers/crypt';
const { REACT_APP_API_URL } = process.env;


const initialState = {
  new: {
    data: null,
    error: null,
    isLoading: false
  },
  delete: {
    data: null,
    error: null,
    isLoading: false
  }
}

export const newCommentFetch = createAsyncThunk('commentSlice/newCommentFetch', async (args, { getState, rejectWithValue }) => {

  const token = getState().session.token;
  const { text, id } = args;
  const cryptedValue = encrypt({ text, id });

  if (!token) throw new Error();

  try {
    const res = await axios.post(REACT_APP_API_URL + "/relationship/comment/", { value: cryptedValue }, {
      headers: {
        Authorization: "Bearer: " + token
      }
    });
    const result = await res.data;
    const decryptedValue = decrypt(result.value);
    return decryptedValue;
  } catch (err) {
    return rejectWithValue(err.response);
  }
})

export const deleteCommentFetch = createAsyncThunk('commentSlice/deleteCommentFetch', async (args, { getState, rejectWithValue }) => {
  const token = getState().session.token;
  const { id, noteId } = args;

  if (!token) throw new Error();

  const cryptedValue = encrypt({ id, noteId });


  try {
    const res = await axios.post(REACT_APP_API_URL + "/relationship/comment/delete", { value: cryptedValue }, {
      headers: {
        Authorization: "Bearer: " + token
      }
    });
    const result = await res.data;
    const decryptedValue = decrypt(result.value);
    return decryptedValue;
  } catch (err) {
    return rejectWithValue(err.response);
  }
})

const commentSlice = createSlice({
  name: 'commentSlice',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(newCommentFetch.pending, state => {
      state.new.isLoading = true;
      state.new.error = null;
      state.new.data = null;
    })
    builder.addCase(newCommentFetch.fulfilled, (state, action) => {
      state.new.data = action.payload
      state.new.error = null;
      state.new.isLoading = false;
    })
    builder.addCase(newCommentFetch.rejected, (state, action) => {
      state.new.error = action.payload;
      state.new.data = null;
      state.new.isLoading = false;
    })
    builder.addCase(deleteCommentFetch.pending, state => {
      state.delete.isLoading = true;
      state.delete.error = null;
      state.delete.data = null;
    })
    builder.addCase(deleteCommentFetch.fulfilled, (state, action) => {
      state.delete.data = action.payload
      state.delete.error = null;
      state.delete.isLoading = false;
    })
    builder.addCase(deleteCommentFetch.rejected, (state, action) => {
      state.delete.error = action.payload;
      state.delete.data = null;
      state.delete.isLoading = false;
    })
  }
})

export default commentSlice.reducer;