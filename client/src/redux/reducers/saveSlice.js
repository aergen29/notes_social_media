import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { decrypt, encrypt } from '../../helpers/crypt';
import axios from 'axios';
const { REACT_APP_API_URL } = process.env;


const initialState = {
  data: null,
  error: null,
  isLoading:false
}

export const saveFetch = createAsyncThunk('saveSlice/saveFetch', async (args, { getState, rejectWithValue }) => {
  const { id, saved } = args;
  const token = getState().session.token;
  if (!token) throw new Error();
  const cryptedValue = encrypt({ id });
  try {
    const res = await saved ?
      axios.post(REACT_APP_API_URL + '/relationship/unsave', { value: cryptedValue }, {
        headers: {
          'Authorization': 'Bearer: ' + token,
        }
      }) :
      axios.post(REACT_APP_API_URL + '/relationship/save', { value: cryptedValue }, {
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

const saveSlice = createSlice({
  name: 'saveSlice',
  initialState,
  reducers: {
    resetSaveState: () => {
      return { ...initialState }
    }
  },
  extraReducers: builder => {
    builder.addCase(saveFetch.pending, state => {
      state.data = null;
      state.error = null;
      state.isLoading = true;
    })
    builder.addCase(saveFetch.fulfilled, (state,action) => {
      state.data = action.payload;
      state.error = null;
      state.isLoading = true;
    })
    builder.addCase(saveFetch.rejected, (state,action) => {
      state.data = null;
      state.error = action.payload;
      state.isLoading = true;
    })
  }
})

export const {resetSaveState} = saveSlice.actions;
export default saveSlice.reducer;