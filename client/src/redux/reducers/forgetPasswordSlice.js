import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';
import { decrypt, encrypt } from '../../helpers/crypt';
import forgetPasswordInputControl from '../inputsControls/forgetPasswordInputControl';
const {REACT_APP_API_URL} = process.env;

const initialState = {
  values: {
    username: '',
    isReady: false
  },
  forFetch: {
    data: null,
    isLoading: false,
    error: null
  }
}


export const forgetPasswordFetch = createAsyncThunk("forgetPasswordSlice/forgetPasswordFetch", async (args, { getState, rejectWithValue }) => {
  const state = getState().forgetPassword;

  const value = {...state.values};
  delete value.isReady;
  const cryptedValue = encrypt(value);
  try{
    const res = await axios.post(REACT_APP_API_URL+"/user/forget",{value:cryptedValue});
    const result = await res.data;
    const decryptedValue = decrypt(result.value);
    return decryptedValue;
  } catch (err) {
    return rejectWithValue(err.response);
  }
})

const forgetPasswordSlice = createSlice({
  name: 'forgetPasswordSlice',
  initialState,
  reducers: {
    setForgetPasswordState: (state, action) => {
      state = current(state);
      const newUsername = action.payload;
      const control = forgetPasswordInputControl(action.payload);
      return {
        ...state,
        values: {
          username: newUsername,
          isReady:control
        }
      }
    },
    resetForgetPasswordFetchState:(state)=> {
      state = current(state);
      let updatedValues = {
        ...state,
        forFetch:initialState.forFetch
      }
      return updatedValues;
    },
    resetForgetPasswordValuesState:(state)=> {
      state = current(state);
      let updatedValues = {
        ...state,        
        values:initialState.values
      }
      return updatedValues;
    }
  },
  extraReducers: builder => {
    builder.addCase(forgetPasswordFetch.pending, state => {
      state.forFetch.isLoading = true;
      state.forFetch.error = null;
    })
    builder.addCase(forgetPasswordFetch.fulfilled, (state, action) => {
      state.forFetch.data = action.payload
      state.forFetch.error = null;
      state.forFetch.isLoading = false;
    })
    builder.addCase(forgetPasswordFetch.rejected, (state, action) => {
      state.forFetch.error = action.payload;
      state.forFetch.data = null;
      state.forFetch.isLoading = false;
    })
  }
})

export const { setForgetPasswordState, resetForgetPasswordValuesState, resetForgetPasswordFetchState } = forgetPasswordSlice.actions;

export default forgetPasswordSlice.reducer;