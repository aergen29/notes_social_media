import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { decrypt, encrypt } from '../../helpers/crypt';
const { REACT_APP_API_URL } = process.env;

const initialState = {
  data: null,
  error: null,
  isLoading: false
}

export const updatePasswordFetch = createAsyncThunk('updatePasswordSlice/updatePasswordFetch', async (args, { getState, rejectWithValue }) => {
  const { newPassword, oldPassword } = args;
  const { token } = getState().session;
  if (!token) throw new Error();


  const cryptedValue = encrypt({ newPassword, oldPassword });

  try {
    const res = await axios.post(REACT_APP_API_URL + "/user/updatepassword", { value: cryptedValue }, {
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

const updatePasswordSlice = createSlice({
  name: 'updatePasswordSlice',
  initialState,
  reducers: {
    resetUpdatePasswordState: () => {
      return { ...initialState }
    }
  },
  extraReducers: builder => {
    builder.addCase(updatePasswordFetch.pending, state => {
      state.isLoading = true;
      state.error = null;
    })
    builder.addCase(updatePasswordFetch.fulfilled, (state, action) => {
      state.data = action.payload
      state.error = null;
      state.isLoading = false;
    })
    builder.addCase(updatePasswordFetch.rejected, (state, action) => {
      state.error = action.payload;
      state.data = null;
      state.isLoading = false;
    })
  }
})

export const { resetUpdatePasswordState } = updatePasswordSlice.actions;
export default updatePasswordSlice.reducer;