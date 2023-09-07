import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { decrypt } from '../../helpers/crypt';
import axios from 'axios';
const { REACT_APP_API_URL } = process.env;


const initialState = {
  data: null,
  error: null,
  isLoading: false
}

export const deleteNoteFetch = createAsyncThunk('deleteNoteSlice/deleteNoteFetch', async (args, { getState, rejectWithValue }) => {
  const { link } = args;
  const token = getState().session.token;
  if (!token) throw new Error();

  try {
    const res = await axios.post(REACT_APP_API_URL + '/note/delete/' + link, {}, {
      headers: {
        'Authorization': 'Bearer: ' + token,
      }
    })
    const result = await res.data;
    const decryptedValue = decrypt(result.value)
    return decryptedValue;
  } catch (err) {
    return rejectWithValue(err.response)
  }

})

const deleteNoteSlice = createSlice({
  name: 'deleteNoteSlice',
  initialState,
  reducers: {
    resetDeleteNoteState: () => {
      return { ...initialState }
    }
  },
  extraReducers: builder => {
    builder.addCase(deleteNoteFetch.pending, state => {
      state.isLoading = true;
      state.data = null;
      state.error = null;
    });
    builder.addCase(deleteNoteFetch.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
      state.error = null;
    });
    builder.addCase(deleteNoteFetch.rejected, (state, action) => {
      state.isLoading = false;
      state.data = null;
      state.error = action.payload;
    })
  }
})


export const { resetDeleteNoteState } = deleteNoteSlice.actions;
export default deleteNoteSlice.reducer;