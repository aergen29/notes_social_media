import { Row, Col, Input, Button, Spinner, Label, Alert } from 'reactstrap';
import { motion } from 'framer-motion';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { changeUserSettingsValue, resetUserSettingsState, userSettingsFetch } from '../../redux/reducers/userSettingsSlice';
import { setSessionState } from '../../redux/reducers/sessionSlice';
import alertify from 'alertifyjs';
import { updatePasswordFetch } from '../../redux/reducers/updatePasswordSlice';
const { REACT_APP_IMAGES_URL } = process.env;


const UpdatePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cookies, setCookie ,removeCookie] = useCookies(['access']);
  const sessionState = useSelector(state => state.session);
  const refreshTokenFetchState = useSelector(state => state.refreshToken);
  const updatePasswordFetchState = useSelector(state => state.updatePassword);
  const [alertMessage, setAlertMessage] = useState(null)
  const [formValues, setFormValues] = useState({
    oldPassword: '',
    newPassword: '',
    newPasswordAgain: '',
    isReady: false,
    wrongInputs: ['oldPassword', 'newPassword', 'newPasswordAgain']
  });

  useEffect(() => {
    if ((refreshTokenFetchState.error || !cookies.access) && !sessionState.username) navigate('/login');
  }, [refreshTokenFetchState])

  useEffect(() => {
    if (updatePasswordFetchState.data) {
      setAlertMessage({ status: true});
      setTimeout(()=>{
        window.location.reload();
        removeCookie('access');
      },3000)
    }
    if (updatePasswordFetchState.error) {
      setAlertMessage({ status: false, message: updatePasswordFetchState.error.data.message });
      setTimeout(()=>setAlertMessage(),3000);
    }
  }, [updatePasswordFetchState])


  const saveChanges = e => {
    if (formValues.isReady) {
      dispatch(updatePasswordFetch({ newPassword: formValues.newPassword, oldPassword: formValues.oldPassword }));
    }
    e.preventDefault();
  }


  const onInputFunc = e => {
    let values = { ...formValues, [e.target.id]: e.target.value };
    let lastValues = formValuesControl(values);
    setFormValues({ ...lastValues })
  }

  let formValuesControl = (formValuesC) => {
    let wrongInputs = [];
    let isReady = true;
    if (formValuesC.oldPassword.length < 3 || formValuesC.oldPassword.length > 28) {
      wrongInputs.push('oldPassword');
      isReady = false;
    }
    if (formValuesC.newPassword.length < 3 || formValuesC.newPassword.length > 28) {
      wrongInputs.push('newPassword');
      isReady = false;
    }
    if (formValuesC.newPasswordAgain.length < 3 || formValuesC.newPasswordAgain.length > 28 || formValuesC.newPassword !== formValuesC.newPasswordAgain) {
      wrongInputs.push('newPasswordAgain');
      isReady = false;
    }
    return { ...formValuesC, wrongInputs, isReady }
  }


  if (sessionState.username === '') return <></>;
  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        className="user-settings-container">
        <Row>
          <Col md="3"></Col>
          <Col md="6">
            <h1 className='text-center'>UPDATE PASSWORD</h1>
            <form onSubmit={saveChanges}>
              <div className='input-box'>
                <Label>Old password:</Label>
                <Input onInput={onInputFunc} invalid={formValues.wrongInputs.indexOf('oldPassword') !== -1} placeholder='**********' id="oldPassword" type='password' />
              </div>
              <div className='input-box'>
                <Label>New password:</Label>
                <Input onInput={onInputFunc} invalid={formValues.wrongInputs.indexOf('newPassword') !== -1} placeholder='**********' id="newPassword" type='password' />
              </div>
              <div className='input-box'>
                <Label>New password again:</Label>
                <Input onInput={onInputFunc} invalid={formValues.wrongInputs.indexOf('newPasswordAgain') !== -1} placeholder='**********' id="newPasswordAgain" type='password' />
              </div>
              {alertMessage ? <>
              <div className='messages-box text-center'>
                <Alert color={alertMessage.status === true ? "success" : "danger"}>
                  {alertMessage.status ? <>Your password is updated. Please login again. </> : <>{alertMessage.message}</>}
                </Alert>
              </div>
            </> : ''}
              <div className="button-box">
                <Button color="primary" type="submit" disabled={!formValues.isReady || updatePasswordFetchState.data}>Save</Button>
              </div>
            </form>
          </Col>
          <Col md="3"></Col>
        </Row>

      </motion.div>
    </>
  )
}

export default UpdatePassword;