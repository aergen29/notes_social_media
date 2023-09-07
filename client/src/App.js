import React, { useEffect, useState } from 'react';
import Login from './components/login/Login.js';
import Signup from './components/signup/Signup.js';
import Main from './components/main/Main.js';
import { Route, Routes } from 'react-router-dom';
import Note from './components/notes/note/Note.js';
import ForgetPassword from './components/forgetpassword/ForgetPassword.js';
import ResetPassword from './components/resetPassword/ResetPassword.js';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import jwt from 'jwt-decode';
import { refreshTokenFetch } from './redux/reducers/refreshTokenSlice.js';
import { setSessionState } from './redux/reducers/sessionSlice.js';


function App() {
  const [cookies, setCookie] = useCookies(['access']);
  const sessionState = useSelector(state => state.session);
  const [sessionState2, setSessionState2] = useState(sessionState)
  const refreshTokenState = useSelector(state => state.refreshToken);
  const dispatch = useDispatch();

  useEffect(() => {
    if (cookies.access) {
      dispatch(refreshTokenFetch());
    }
  }, [])

  useEffect(() => {
    let intervalId;
    if (sessionState2.username !== '') {
      intervalId = setInterval(intervalProcesses(sessionState2), 30000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [sessionState2])

  useEffect(() => {
    setSessionState2(sessionState);
  }, [sessionState])

  const intervalProcesses = sessionStateValue => function(){
    let accessToken = sessionStateValue.token;
    if (!accessToken) return;
    const tokenExpiration = jwt(accessToken).exp;
    const currentTime = Math.floor(Date.now() / 1000);
    if (cookies.access && tokenExpiration && tokenExpiration - currentTime < 30) {
      dispatch(refreshTokenFetch());
    }
  }

  useEffect(() => {
    if (refreshTokenState.data) {
      dispatch(setSessionState(refreshTokenState.data.body));
    }
  }, [refreshTokenState])



  return (
    <Routes>
      <Route
        path="/login"
        element={<Login />}
      />
      <Route
        path="/resetpassword/:token"
        element={<ResetPassword />}
      />
      <Route
        path="/signup"
        element={<Signup />}
      />
      <Route
        path="/forgetpassword"
        element={<ForgetPassword />}
      />
      <Route
        path="/*"
        element={<Main />}
      />
      <Route
        path="/note/:link"
        element={<Note />}
      />
      <Route
        path='*'
        element={<h1 className='text-center'>404 NOT FOUND</h1>}
      />

    </Routes>
  );
}

export default App;
