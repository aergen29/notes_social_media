import './resetpassword.css';
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, Input, Button, Spinner, Alert } from 'reactstrap';
import { resetPasswordFetchGet, resetPasswordFetchPut, setResetPasswordValues } from '../../redux/reducers/resetPasswordSlice';

const ResetPassword = () => {
  const [alertMessage,setAlertMessage] = useState(null);
  const navigate = useNavigate();
  const stateGetFetch = useSelector(state => state.resetPassword.forFetch.get);
  const { token } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setResetPasswordValues({ name: 'urlToken', value: token }))
    dispatch(resetPasswordFetchGet());
  }, [])
  useEffect(() => {
    if (stateGetFetch.error) {
      setTimeout(() => {
        navigate('/login');
      }, 3000)
    }
  }, [stateGetFetch])
  return (
    <>
      <div className='reset-password-container'>
        <Row>
          <Col md="3"></Col>
          <Col md="6">
            <div className='form-box'>
              <h1 className='text-center'>RESET PASSWORD</h1>
              {stateGetFetch.isLoading ? <><div className='text-center'><Spinner /></div></> : ""}
              {stateGetFetch.error ? <><ErrorComp /></> : ""}
              {stateGetFetch.data ? <><FormComp setAlertMessage={setAlertMessage} navigate={navigate} /></> : ""}

              {alertMessage ? <>
              <div className='messages-box text-center'>
                <Alert color={alertMessage.status === true ? "success" : "danger"}>
                  {alertMessage.status ? <>Your password is updated. You are being directed. </> : <>{alertMessage.message}</>}
                </Alert>
              </div>
            </> : ''}
            </div>            
          </Col>
          <Col md="3"></Col>
        </Row>
      </div >
    </>
  )
}


const FormComp = ({setAlertMessage, navigate}) => {
  const statePutFetch = useSelector(state => state.resetPassword.forFetch.put);
  const [buttonStatus,setButtonStatus] = useState(false)
  const state = useSelector(state => state.resetPassword.values);
  const dispatch = useDispatch();
  const formSubmit = e=>{
    setButtonStatus(true);
    dispatch(resetPasswordFetchPut());
    e.preventDefault();
  }
  const onInputFunc = e=>{
    dispatch(setResetPasswordValues({name:'password',value:e.target.value}));
  }
  useEffect(()=>{
    setButtonStatus(true)
    if(statePutFetch.error) typeof statePutFetch.error.data === "string"? setAlertMessage({status:false,message:statePutFetch.error.data}):setAlertMessage(statePutFetch.error.data);
    if(statePutFetch.data){
      setAlertMessage({status:true});
      setTimeout(()=>{
        navigate('/login');
      },3000)
    }
    setTimeout(()=>{
      setAlertMessage(null);
      setButtonStatus(false);
    },5000)
  },[statePutFetch])
  return (
    <>
      <form className='text-left' onSubmit={formSubmit}>
        <label htmlFor="password">Password:</label>
        <Input onInput={onInputFunc} autoComplete='off' id="password" type="password" placeholder='***********' required />
        <br />
        <div className='text-center'>
          <Button color="primary" disabled={!state.isReady || buttonStatus} >{statePutFetch.isLoading?<><Spinner/></>:'Save'}</Button>
        </div>
      </form>
    </>
  )
}

const ErrorComp = () => {
  return (
    <>
      <h1 style={{ marginTop: '3em' }} className='text-danger text-center'>This token is wrong</h1>
      <h5 style={{marginTop:'1em'}} className='text-center'>You are being redirected to the login page <br/><Spinner style={{marginTop:'1em'}} color="muted"/></h5>
    </>
  )
}





export default ResetPassword;