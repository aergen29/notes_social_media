import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';
import newNoteInputsControl from '../inputsControls/newNoteInputsControl';
import axios from 'axios';
import { decrypt, encrypt } from '../../helpers/crypt';
const { REACT_APP_API_URL } = process.env;

const initialState = {
  values: {
    html: '',
    text: '',
    private: false,
    isReady: false
  },
  forFetch: {
    data: null,
    error: null,
    isLoading: null
  }
}

export const newNoteFetch = createAsyncThunk("newNoteSlice/newNoteFetch", async (args, { getState, rejectWithValue }) => {
  const state = getState().newNote.values;
  const token = getState().session.token;
  if (!state.isReady || !token) throw new Error();
  const cryptedValue = encrypt({
    html: state.html,
    text: state.text,
    accessibility: state.private ? 'private' : 'public'
  });
  try {
    const res = await axios.post(REACT_APP_API_URL + '/note', { value: cryptedValue }, {
      headers: {
        Authorization: 'Bearer: ' + token
      }
    })
    const result = await res.data;
    const decryptedValue = decrypt(result.value);
    return decryptedValue;
  }catch(err){
    return rejectWithValue(err.response);
  }
})


const newNoteSlice = createSlice({
  name: 'newNote',
  initialState,
  reducers: {
    setNewNoteValues: (state, action) => {
      state = current(state);
      const values = action.payload;
      const control = newNoteInputsControl(values[1]);
      return {
        ...state,
        values: {
          ...state.values,
          html: values[0],
          text: values[1],
          private: values[2],
          isReady: control
        }
      }
    },
    resetNewNoteState: ()=>{
      return {...initialState};
    }
  },
  extraReducers: builder=>{
    builder.addCase(newNoteFetch.pending, state => {
      state.forFetch.isLoading = true;
      state.forFetch.error = null;
      state.forFetch.data = null;
    })
    builder.addCase(newNoteFetch.fulfilled, (state, action) => {
      state.forFetch.data = action.payload
      state.forFetch.error = null;
      state.forFetch.isLoading = false;
    })
    builder.addCase(newNoteFetch.rejected, (state, action) => {
      state.forFetch.error = action.payload;
      state.forFetch.data = null;
      state.forFetch.isLoading = false;
    })
  }
})

export const { setNewNoteValues,resetNewNoteState } = newNoteSlice.actions;
export default newNoteSlice.reducer;