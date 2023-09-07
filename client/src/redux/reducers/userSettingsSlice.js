import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';
import userSettingsInputsControl from '../inputsControls/userSettingsInputsControl';
import { decrypt, encrypt } from '../../helpers/crypt';
import axios from 'axios';
const { REACT_APP_API_URL } = process.env;

const initialState = {
  values: {
    name: '',
    username: '',
    email: '',
    bio: '',
    image: null,
    wrongInputs: [],
    isReady: false
  },
  forFetch: {
    data: null,
    error: null,
    isLoading: false
  }
}

export const userSettingsFetch = createAsyncThunk('userSettingsSlice/userSettingsFetch', async (args, { getState, rejectWithValue }) => {
  const { image } = args;
  const state = getState().userSettings.values;
  const token = getState().session.token;
  if (!token) throw new Error();
  const data = new FormData();
  data.append('name', state.name);
  data.append('username', state.username);
  data.append('email', state.email);
  data.append('bio', state.bio);
  if (image) data.append('profile_image', image);
  try {
    const res = await axios.post(REACT_APP_API_URL + '/user/edit', data, {
      headers: {
        'Authorization': 'Bearer: ' + token,
        'Content-Type': 'multipart/form-data',
      },
    })
    const result = await res.data;
    const decryptedValue = decrypt(result.value);
    return decryptedValue;
  } catch (err) {
    rejectWithValue(err);
  }

})


const userSettingsSlice = createSlice({
  name: 'userSettingsSlice',
  initialState,
  reducers: {
    changeUserSettingsValue: (state, action) => {
      state = current(state);
      let newState = { ...state };
      const { name, value } = action.payload;
      const updatedValues = newState.values[name] !== undefined ? { ...newState.values, [name]: value } : { ...newState.values };
      const controls = userSettingsInputsControl(updatedValues);
      return {
        ...newState,
        values: {
          ...updatedValues,
          isReady: controls.isReady,
          wrongInputs: controls.wrongInputs
        }
      };
    },
    resetUserSettingsState:()=>{
      return {...initialState};
    }
  },
  extraReducers: builder => {
    builder.addCase(userSettingsFetch.pending, state=>{
      state.forFetch.isLoading = true;
      state.forFetch.data = null;
      state.forFetch.error = null;
    });
    builder.addCase(userSettingsFetch.fulfilled, (state,action)=>{
      state.forFetch.data = action.payload;
      state.forFetch.error = null;
    });
    builder.addCase(userSettingsFetch.rejected, (state,action)=>{
      state.forFetch.data = null;
      state.forFetch.error = action.payload;
    });
  }
})

export const { changeUserSettingsValue,resetUserSettingsState } = userSettingsSlice.actions;
export default userSettingsSlice.reducer;