import React, { useEffect, useState } from 'react';
import { Row, Col, Input, Button, Alert, Spinner } from 'reactstrap';
import { Link, useNavigate } from "react-router-dom";
import './forgetpassword.css'
import { useDispatch, useSelector } from 'react-redux';
import { forgetPasswordFetch, resetForgetPasswordFetchState, resetForgetPasswordValuesState, setForgetPasswordState } from '../../redux/reducers/forgetPasswordSlice';
import { useCookies } from 'react-cookie';

const ForgetPassword = () => {
  const [cookies, setCookie] = useCookies(['access']);
  const navigate = useNavigate();
  const [buttonStatus, setButtonStatus] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null)
  const dispatch = useDispatch();
  const state = useSelector(state => state.forgetPassword.values);
  const stateFetch = useSelector(state => state.forgetPassword.forFetch);
  const refreshTokenFetchState = useSelector(state => state.refreshToken);

  const onInputFunc = e => {
    dispatch(setForgetPasswordState(e.target.value));
  }

  const formSubmit = e => {
    dispatch(forgetPasswordFetch())
    e.preventDefault();
  }

  useEffect(() => {
    dispatch(resetForgetPasswordValuesState());
  }, [])

  useEffect(() => {
    if(refreshTokenFetchState.data) navigate('/')
  }, [refreshTokenFetchState])

  useEffect(() => {
    setButtonStatus(true);
    if (stateFetch.error) typeof stateFetch.error.data === "string" ? setAlertMessage({ status: false, message: stateFetch.error.data }) : setAlertMessage(stateFetch.error.data);
    if (stateFetch.data) {
      setAlertMessage({ status: true, message:stateFetch.data.message });
      setTimeout(() => {
        setButtonStatus(false);
        navigate('/login');
      }, 3000)
    }
    setTimeout(() => {
      dispatch(resetForgetPasswordFetchState());
      setAlertMessage(null);
      setButtonStatus(false);
    }, 3000)
  }, [stateFetch])

  
  if(cookies.access) return <><div className="text-center" style={{ fontSize: '3em', height: '50px' }}><Spinner style={{ width: '100px', height: '100px' }} /></div></>;
  return (
    <div className='forget-password-container'>
      <Row>
        <Col md="3"></Col>
        <Col md="6">
          <div className='form-box'>
            <h1 className='text-center'>FORGET PASSWORD</h1>
            <form className='text-left' onSubmit={formSubmit}>
              <label htmlFor="username">Username or Email:</label>
              <Input className={!state.isReady ? "wrong-input" : ""} autoComplete='off' onInput={onInputFunc} id="username" placeholder='username or example@example.com' required />
              <br />
              <div className='text-center'>
                <Button color="primary" disabled={!state.isReady || buttonStatus}>{stateFetch.isLoading?<><Spinner/></>:'Forget'}</Button>
              </div>
            </form>
            {alertMessage ? <>
              <div className='messages-box text-center'>
                <Alert color={alertMessage.status === true ? "success" : "danger"}>
                  {alertMessage.message}
                </Alert>
              </div>
            </> : ''}
            <div className='messages-box text-center'>
              <Link to="/login">Do you remember password?</Link>
              <div className="signup-box">
                <Link to="/signup"> Do not have account? </Link>
              </div>
            </div>
          </div>
        </Col>
        <Col md="3"></Col>
      </Row>
    </div>
  );
}

export default ForgetPassword;