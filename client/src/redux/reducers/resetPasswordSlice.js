import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import axios from "axios";
import resetPasswordInputControl from "../inputsControls/resetPasswordInputControl";
import { decrypt, encrypt } from "../../helpers/crypt";
const { REACT_APP_API_URL } = process.env;

const initialState = {
  values: {
    urlToken: '',
    password: '',
    isReady: false,
    token: ''
  },
  forFetch: {
    get: {
      data: null,
      isLoading: false,
      error: null
    },
    put: {
      data: null,
      isLoading: false,
      error: null
    }
  }
}

export const resetPasswordFetchGet = createAsyncThunk("resetPasswordSlice/resetPasswordFetchGet", async (args, { getState, rejectWithValue }) => {
  const state = getState().resetPassword;
  const urlToken = state.values.urlToken;

  try {
    const res = await axios.get(`${REACT_APP_API_URL}/user/resetpassword/${urlToken}`);
    const result = await res.data;
    const decryptedValue = decrypt(result.value);
    return decryptedValue;
  } catch (err) {
    return rejectWithValue(err.response)
  }
})

export const resetPasswordFetchPut = createAsyncThunk("resetPasswordSlice/resetPasswordFetchPut", async (args, { getState, rejectWithValue }) => {
  const state = getState().resetPassword;
  const token = state.values.token;
  const newPassword = state.values.password;
  const cryptedValue = encrypt({ newPassword });
  try {
    const res = await axios.put(REACT_APP_API_URL + '/user/resetpassword', { value: cryptedValue }, {
      headers: {
        'Authorization': 'Bearer: ' + token,
      }
    });
    const result = await res.data;
    const decryptedValue = decrypt(result.value)
    return decryptedValue;
  } catch (err) {
    return rejectWithValue(err.response)
  }
})

const resetPasswordSlice = createSlice({
  name: 'resetPasswordSlice',
  initialState,
  reducers: {
    setResetPasswordValues: (state, action) => {
      state = current(state);
      let newState = { ...state };
      const { name, value } = action.payload;
      const updatedValues = newState.values[name] !== undefined ? { ...newState.values, [name]: value } : { ...newState.values };
      const control = name === 'password' ? resetPasswordInputControl(value) : false;
      return {
        ...newState,
        values: {
          ...updatedValues,
          isReady: control,
          urlToken: name === 'urlToken' ? value : state.values.urlToken
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(resetPasswordFetchGet.pending, state => {
      state.forFetch.get.isLoading = true;
      state.forFetch.get.error = null;
    })
    builder.addCase(resetPasswordFetchGet.fulfilled, (state, action) => {
      state.values.token = action.payload.body.token;
      state.forFetch.get.data = action.payload;
      state.forFetch.get.error = null;
      state.forFetch.get.isLoading = false;
    })
    builder.addCase(resetPasswordFetchGet.rejected, (state, action) => {
      state.forFetch.get.error = action.payload;
      state.forFetch.get.data = null;
      state.forFetch.get.isLoading = false;
    })
    builder.addCase(resetPasswordFetchPut.pending, state => {
      state.forFetch.put.isLoading = true;
      state.forFetch.put.error = null;
    })
    builder.addCase(resetPasswordFetchPut.fulfilled, (state, action) => {
      state.values.token = action.payload.body.token;
      state.forFetch.put.data = action.payload;
      state.forFetch.put.error = null;
      state.forFetch.put.isLoading = false;
    })
    builder.addCase(resetPasswordFetchPut.rejected, (state, action) => {
      state.forFetch.put.error = action.payload;
      state.forFetch.put.data = null;
      state.forFetch.put.isLoading = false;
    })
  }
})

export const { setResetPasswordValues } = resetPasswordSlice.actions;
export default resetPasswordSlice.reducer;