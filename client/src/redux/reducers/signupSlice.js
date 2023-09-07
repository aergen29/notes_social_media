import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';
import { decrypt, encrypt } from '../../helpers/crypt';
import axios from 'axios';
import signupInputsControl from '../inputsControls/signupInputsControl';
const {REACT_APP_API_URL} = process.env;

const initialState = {
  values: {
    email: '',
    name: '',
    username: '',
    password: '',
    isReady: false,
    wrongInputs: ['email','name','username','password']
  },
  forFetch: {
    data: null,
    isLoading: false,
    error: null
  }
}


export const signupFetch = createAsyncThunk("signupSlice/signupFetch", async (args, { getState, rejectWithValue }) => {
  const state = getState().signup;

  const value = {...state.values};
  delete value.isReady;
  delete value.wrongInputs;
  const cryptedValue = encrypt(value);

  try {
    const res = await axios.post(REACT_APP_API_URL+"/user/signup", { value: cryptedValue });
    const result = await res.data;
    const decryptedValue = decrypt(result.value);
    console.log(decryptedValue)
    return decryptedValue;
  } catch (err) {
    return rejectWithValue(err.response);
  }
})

const signupSlice = createSlice({
  name: 'signupSlice',
  initialState,
  reducers: {
    setSignupState: (state, action) => {
      state = current(state);
      let newState = {...state};
      const { name, value } = action.payload;
      const updatedValues = newState.values[name] !== undefined?{ ...newState.values, [name]: value }:{ ...newState.values};
      const controls = signupInputsControl(updatedValues);
      return {
        ...newState,
        values: {
          ...updatedValues,
          isReady: controls.isReady,
          wrongInputs: controls.wrongInputs
        }
      };
    },
    resetSignupFetchState:(state)=> {
      state = current(state);
      let updatedValues = {
        ...state,
        forFetch:initialState.forFetch
      }
      return updatedValues;
    },
    resetSignupValuesState:(state)=> {
      state = current(state);
      let updatedValues = {
        ...state,        
        values:initialState.values
      }
      return updatedValues;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(signupFetch.pending, state => {
      state.forFetch.isLoading = true;
      state.forFetch.error = null;
    })
    builder.addCase(signupFetch.fulfilled, (state, action) => {
      state.forFetch.data = action.payload
      state.forFetch.error = null;
      state.forFetch.isLoading = false;
    })
    builder.addCase(signupFetch.rejected, (state, action) => {
      state.forFetch.error = action.payload;
      state.forFetch.data = null;
      state.forFetch.isLoading = false;
    })
  }
})

export const { setSignupState, resetSignupFetchState, resetSignupValuesState } = signupSlice.actions;
export default signupSlice.reducer;