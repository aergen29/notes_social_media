import React, { useEffect, useState } from 'react';
import './signup.css';
import { Row, Col, Input, Button, Spinner, Alert } from 'reactstrap';
import Typewriter from '../helper/Typewriter';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { setSignupState, resetSignupFetchState, signupFetch, resetSignupValuesState } from '../../redux/reducers/signupSlice';
import { useCookies } from 'react-cookie';

const Signup = () => {
  const [cookies, setCookie] = useCookies(['access']);
  const navigate = useNavigate();
  const state = useSelector(state => state.signup.values);
  const fetchState = useSelector(state => state.signup.forFetch);
  const refreshTokenFetchState = useSelector(state => state.refreshToken);
  const dispatch = useDispatch();
  const [alertMessage, setAlertMessage] = useState(null);
  const [buttonStatus, setButtonStatus] = useState(false);
  const onInputFunc = e => {
    dispatch(setSignupState({ name: e.target.id, value: e.target.value }));
  }
  const formSubmit = e => {
    dispatch(signupFetch());
    e.preventDefault();
  }
  useEffect(() => {
    dispatch(resetSignupValuesState());
  }, [])

  useEffect(() => {
    if(refreshTokenFetchState.data) navigate('/');
  }, [refreshTokenFetchState])


  useEffect(() => {
    setButtonStatus(true)
    if (fetchState.error) typeof fetchState.error.data === "string"? setAlertMessage({status:false,message:fetchState.error.data}):setAlertMessage(fetchState.error.data);  
    if (fetchState.data) {
      setAlertMessage({ status: true });
      setTimeout(() => {
        setButtonStatus(false);
        navigate('/login');
      }, 3000)
    }
    setTimeout(() => {
      dispatch(resetSignupFetchState());
      setButtonStatus(false);
      setAlertMessage(null);
    }, 5000)
  }, [fetchState])


  const typewriterTexts = [
    "JUST ",
    "WRITE "
  ]
  if(cookies.access) return <><div className="text-center" style={{ fontSize: '3em', height: '50px' }}><Spinner style={{ width: '100px', height: '100px' }} /></div></>;
  return (
    <div className='signupContainer'>
      <Row>
        <Col md="6" className='left-box text-center'>
          <div className='text-center'>
            <Typewriter texts={typewriterTexts} speed={100} />
          </div>
        </Col>
        <Col md="4">
          <div className='form-box'>
            <h1 className='text-center'>SIGN UP</h1>
            <form className='text-left' autoComplete='off' onSubmit={formSubmit}>
              <label htmlFor="email">Email:</label>
              <Input id="email" className={state.wrongInputs.indexOf('email') > -1 ? 'wrong-input' : ''} onChange={onInputFunc} placeholder='example@example.com' required type="email" />
              <br />
              <label htmlFor="name">Name:</label>
              <Input id="name" className={state.wrongInputs.indexOf('name') > -1 ? 'wrong-input' : ''} onChange={onInputFunc} placeholder='Name' required type="text" />
              <br />
              <label htmlFor="username">Username:</label>
              <Input id="username" className={state.wrongInputs.indexOf('username') > -1 ? 'wrong-input' : ''} onChange={onInputFunc} placeholder='username' required type="text" />
              <br />
              <label htmlFor="password">Password:</label>
              <Input id="password" className={state.wrongInputs.indexOf('password') > -1 ? 'wrong-input' : ''} onChange={onInputFunc} placeholder='*************' required type="password" />
              <br />
              <div className='text-center'>
                <Button color="primary" disabled={!state.isReady || buttonStatus}>{fetchState.isLoading ? <><Spinner /></> : 'Sign up'}</Button>
              </div>
            </form>
            {alertMessage ? <>
              <div className='messages-box text-center'>
                <Alert color={alertMessage.status === true ? "success" : "danger"}>
                  {alertMessage.status ? <>You have registered successfully. <Link to="/login"> Login </Link></> : <>{alertMessage.message}</>}
                </Alert>
              </div>
            </> : ''}
            <div className='messages-box text-center'>
              <div className="login-box">
                <Link to="/login"> Have account? </Link>
              </div>
            </div>
          </div>
        </Col>
        <Col md="2"></Col>
      </Row>
    </div>
  );
}

export default Signup;