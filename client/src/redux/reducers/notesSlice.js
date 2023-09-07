import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { decrypt, encrypt } from "../../helpers/crypt";
const { REACT_APP_API_URL } = process.env;

const initialState = {
  values: {
    notes: [],
    note: null
  },
  forFetch: {
    data: null,
    error: null,
    isLoading: false
  },
  forProfileFetch: {
    data: null,
    error: null,
    isLoading: false
  },
  forNoteFetch: {
    data: null,
    error: null,
    isLoading: false
  }
}

export const getNotesFetch = createAsyncThunk('notesSlice/getNotesFetch', async (args, { getState, rejectWithValue }) => {
  const token = getState().session.token;
  if (!token) throw new Error();

  try {
    const res = await axios.get(REACT_APP_API_URL + "/note/getMany/main", {
      headers: {
        'Authorization': 'Bearer: ' + token,
      }

    });
    const result = await res.data;
    const decryptedValue = decrypt(result.value);
    return decryptedValue;
  } catch (err) {
    return rejectWithValue(err.response);
  }
})

export const getNoteFetch = createAsyncThunk('notesSlice/getNoteFetch', async (args, { getState, rejectWithValue }) => {
  const link = args;
  const token = getState().session.token;

  try {
    const res = await axios.get(REACT_APP_API_URL + "/note/" + link, {
      headers: {
        'Authorization': 'Bearer: ' + token,
      }
    });
    const result = await res.data;
    const decryptedValue = decrypt(result.value);
    return decryptedValue;
  } catch (err) {
    return rejectWithValue(err.response);
  }
})

export const getNotesProfileFetch = createAsyncThunk('notesSlice/getNotesProfileFetch', async (args, { getState, rejectWithValue }) => {
  const username = args;
  const token = getState().session.token;

  const cryptedValue = encrypt({ username })
  let headers = null;
  if (token) headers = { 'Authorization': 'Bearer: ' + token };

  try {
    const res = await axios.post(REACT_APP_API_URL + "/note/getmany/profile", { value: cryptedValue }, { headers });
    const result = await res.data;
    const decryptedValue = decrypt(result.value);
    return decryptedValue;
  } catch (err) {
    return rejectWithValue(err.response);
  }
})



const notesSlice = createSlice({
  name: "notesSlice",
  initialState,
  reducers: {
    setNotesState: (state, action) => {
      return {
        ...state,
        values: {
          ...state.values,
          for: action.payload
        }
      };
    },
    resetNotesValues: (state, action) => {
      return {
        ...state,
        values: initialState.values
      }
    }
  },
  extraReducers: builder => {
    builder.addCase(getNotesFetch.pending, state => {
      state.forFetch.isLoading = true;
      state.forFetch.error = null;
      state.forFetch.data = null;
    })
    builder.addCase(getNotesFetch.fulfilled, (state, action) => {
      state.forFetch.error = null;
      state.forFetch.isLoading = false;
      state.forFetch.data = action.payload;
    })
    builder.addCase(getNotesFetch.rejected, (state, action) => {
      state.forFetch.error = action.payload;
      state.forFetch.data = null;
      state.forFetch.isLoading = false;
    })
    builder.addCase(getNoteFetch.pending, state => {
      state.forNoteFetch.isLoading = true;
      state.forNoteFetch.error = null;
      state.forNoteFetch.data = null;
    })
    builder.addCase(getNoteFetch.fulfilled, (state, action) => {
      state.forNoteFetch.isLoading = false;
      state.forNoteFetch.error = null;
      state.forNoteFetch.data = action.payload;
    })
    builder.addCase(getNoteFetch.rejected, (state, action) => {
      state.forNoteFetch.error = action.payload;
      state.forNoteFetch.data = null;
      state.forNoteFetch.isLoading = false;
    })
    builder.addCase(getNotesProfileFetch.pending, state => {
      state.forProfileFetch.isLoading = true;
      state.forProfileFetch.error = null;
    })
    builder.addCase(getNotesProfileFetch.fulfilled, (state, action) => {
      state.forProfileFetch.isLoading = false;
      state.forProfileFetch.data = action.payload;
      state.forProfileFetch.error = null;
    })
    builder.addCase(getNotesProfileFetch.rejected, (state, action) => {
      state.forProfileFetch.error = action.payload;
      state.forProfileFetch.data = null;
      state.forProfileFetch.isLoading = false;
    })
  }
})

export const { setNotesState, resetNotesValues } = notesSlice.actions;
export default notesSlice.reducer;