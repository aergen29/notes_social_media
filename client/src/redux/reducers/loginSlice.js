import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';
import { decrypt, encrypt } from '../../helpers/crypt';
import axios from 'axios';
import loginInputsControl from '../inputsControls/loginInputsControl';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
const {REACT_APP_API_URL} = process.env;

const initialState = {
  values: {
    username: '',
    password: '',
    isReady: false,
    wrongInputs: ['username','password']
  },
  forFetch: {
    data: null,
    isLoading: false,
    error: null
  }
}


export const loginFetch = createAsyncThunk("loginSlice/loginFetch", async (args, { getState, rejectWithValue }) => {
  const state = getState().login;

  const value = {...state.values};
  delete value.isReady;
  delete value.wrongInputs;
  const cryptedValue = encrypt(value);

  try {
    const res = await axios.post(REACT_APP_API_URL+"/auth/login", { value: cryptedValue});
    const result = await res.data;
    const decryptedValue = decrypt(result.value);
    const refreshToken = decryptedValue.body.refreshToken;
    cookies.set('access', refreshToken, { path: '/' });
    return decryptedValue;
  } catch (err) {
    return rejectWithValue(err.response);
  }
})

const loginSlice = createSlice({
  name: 'loginSlice',
  initialState,
  reducers: {
    setLoginState: (state, action) => {
      state = current(state);
      let newState = {...state};
      const { name, value } = action.payload;
      const updatedValues = newState.values[name] !== undefined?{ ...newState.values, [name]: value }:{ ...newState.values};
      const controls = loginInputsControl(updatedValues);
      return {
        ...newState,
        values: {
          ...updatedValues,
          isReady: controls.isReady,
          wrongInputs: controls.wrongInputs
        }
      };
    },
    resetLoginFetchState:(state)=> {
      state = current(state);
      let updatedValues = {
        ...state,
        forFetch:initialState.forFetch
      }
      return updatedValues;
    },
    resetLoginValuesState:(state)=> {
      state = current(state);
      let updatedValues = {
        ...state,        
        values:initialState.values
      }
      return updatedValues;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loginFetch.pending, state => {
      state.forFetch.isLoading = true;
      state.forFetch.error = null;
    })
    builder.addCase(loginFetch.fulfilled, (state, action) => {
      state.forFetch.data = action.payload
      state.forFetch.error = null;
      state.forFetch.isLoading = false;
    })
    builder.addCase(loginFetch.rejected, (state, action) => {
      state.forFetch.error = action.payload;
      state.forFetch.data = null;
      state.forFetch.isLoading = false;
    })
  }
})

export const { setLoginState, resetLoginFetchState, resetLoginValuesState } = loginSlice.actions;
export default loginSlice.reducer;