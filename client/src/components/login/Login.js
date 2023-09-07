import React, { useEffect, useState } from 'react';
import './login.css';
import { Row, Col, Input, Button, Alert, Spinner } from 'reactstrap';
import Typewriter from '../helper/Typewriter';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { setLoginState, resetLoginFetchState, resetLoginValuesState, loginFetch } from '../../redux/reducers/loginSlice';
import { setSessionState } from '../../redux/reducers/sessionSlice';
import { useCookies } from 'react-cookie';


const Login = () => {
  const [cookies, setCookie] = useCookies(['access']);
  const [buttonStatus, setButtonStatus] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null)
  const navigate = useNavigate();
  const state = useSelector(state => state.login.values);
  const stateFetch = useSelector(state => state.login.forFetch);
  const refreshTokenFetchState = useSelector(state => state.refreshToken);
  const dispatch = useDispatch();
  const onInputFunc = e => {
    dispatch(setLoginState({ name: e.target.id, value: e.target.value }));
  }
  useEffect(() => {
    dispatch(resetLoginValuesState());
  }, [])

  useEffect(() => {
    if (refreshTokenFetchState.data) navigate('/');
  }, [refreshTokenFetchState])

  useEffect(() => {
    setButtonStatus(true);
    if (stateFetch.error) typeof stateFetch.error.data === "string" ? setAlertMessage({ status: false, message: stateFetch.error.data }) : setAlertMessage(stateFetch.error.data);
    if (stateFetch.data) {
      dispatch(setSessionState(stateFetch.data.body))
      setAlertMessage({ status: true });
      setTimeout(() => {
        setButtonStatus(false);
        navigate('/');
      }, 3000)
    }
    setTimeout(() => {
      dispatch(resetLoginFetchState());
      setAlertMessage(null);
      setButtonStatus(false);
    }, 3000)
  }, [stateFetch])

  const formSubmit = e => {
    dispatch(loginFetch());
    e.preventDefault();
  }

  const typewriterTexts = [
    "JUST ",
    "LOOK "
  ]
  if (cookies.access) return <><div className="text-center" style={{ fontSize: '3em', height: '50px' }}><Spinner style={{ width: '100px', height: '100px' }} /></div></>;
  return (
    <div className='loginContainer'>
      <Row>
        <Col md="6" className='left-box text-center'>
          <div className='text-center'>
            <Typewriter texts={typewriterTexts} speed={100} />
          </div>
        </Col>
        <Col md="4">
          <div className='form-box'>
            <h1 className='text-center'>LOGIN</h1>
            <form className='text-left' autoComplete='off' onSubmit={formSubmit}>
              <label htmlFor="username">Username or Email:</label>
              <Input id="username" className={state.wrongInputs.indexOf('username') > -1 ? "wrong-input" : ""} onChange={onInputFunc} placeholder='username or example@example.com' required />
              <br />
              <label htmlFor="password">Password:</label>
              <Input id="password" className={state.wrongInputs.indexOf('password') > -1 ? "wrong-input" : ""} onChange={onInputFunc} placeholder='*************' required type="password" />
              <br />
              <div className='text-center'>
                <Button color="primary" disabled={!state.isReady || buttonStatus}>{stateFetch.isLoading ? <><Spinner /></> : "Login"}</Button>
              </div>
            </form>
            {alertMessage ? <>
              <div className='messages-box text-center'>
                <Alert color={alertMessage.status === true ? "success" : "danger"}>
                  {alertMessage.status ? <>You have logined successfully. </> : <>{alertMessage.message}</>}
                </Alert>
              </div>
            </> : ''}
            <div className='messages-box text-center'>
              <Link to="/forgetpassword">Do you forget password?</Link>
              <div className="signup-box">
                <Link to="/signup"> Do not have account? </Link>
              </div>
            </div>
          </div>
        </Col>
        <Col md="2"></Col>
      </Row>
    </div>
  );
}

export default Login;