import {configureStore } from '@reduxjs/toolkit';
import loginSlice from './reducers/loginSlice';
import signupSlice from './reducers/signupSlice';
import sessionSlice from './reducers/sessionSlice';
import forgetPasswordSlice from './reducers/forgetPasswordSlice';
import resetPasswordSlice from './reducers/resetPasswordSlice';
import notesSlice from './reducers/notesSlice';
import mostUsersSlice from './reducers/mostUsersSlice';
import searchSlice from './reducers/searchSlice';
import visitSlice from './reducers/visitSlice';
import newNoteSlice from './reducers/newNoteSlice';
import refreshTokenSlice from './reducers/refreshTokenSlice';
import likeSlice from './reducers/likeSlice';
import saveSlice from './reducers/saveSlice';
import commentSlice from './reducers/commentSlice';
import editNoteSlice from './reducers/editNoteSlice';
import deleteNoteSlice from './reducers/deleteNoteSlice';
import userSettingsSlice from './reducers/userSettingsSlice';
import followSlice from './reducers/followSlice';
import updatePasswordSlice from './reducers/updatePasswordSlice';



export default configureStore({
  reducer:{
    login:loginSlice,
    signup:signupSlice,
    session:sessionSlice,
    forgetPassword:forgetPasswordSlice,
    resetPassword:resetPasswordSlice,
    notes:notesSlice,
    mostUsers:mostUsersSlice,
    search:searchSlice,
    visit:visitSlice,
    newNote:newNoteSlice,
    refreshToken:refreshTokenSlice,
    like:likeSlice,
    save:saveSlice,
    comment:commentSlice,
    editNote:editNoteSlice,
    deleteNote:deleteNoteSlice,
    userSettings:userSettingsSlice,
    follow:followSlice,
    updatePassword:updatePasswordSlice
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false})
})
