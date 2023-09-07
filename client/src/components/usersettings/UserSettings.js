import './usersettings.css';
import { Row, Col, Input, Button, Spinner } from 'reactstrap';
import { motion } from 'framer-motion';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { changeUserSettingsValue, resetUserSettingsState, userSettingsFetch } from '../../redux/reducers/userSettingsSlice';
import { setSessionState } from '../../redux/reducers/sessionSlice';
import alertify from 'alertifyjs';
const { REACT_APP_IMAGES_URL } = process.env;


const UserSettings = () => {
  const dispatch = useDispatch();
  const [cookies, setCookie] = useCookies(['access']);
  const sessionState = useSelector(state => state.session);
  const refreshTokenFetchState = useSelector(state => state.refreshToken);
  const [newProfileImage, setNewProfileImage] = useState(null);
  const userSettingsValuesState = useSelector(state => state.userSettings.values);
  const userSettingsFetchState = useSelector(state => state.userSettings.forFetch);
  const [isOpeningValuesWrited, setIsOpeningValuesWrited] = useState(false);
  const [image, setImage] = useState();

  const navigate = useNavigate();
  useEffect(() => {
    if ((refreshTokenFetchState.error || !cookies.access) && !sessionState.username) navigate('/login');
  }, [refreshTokenFetchState])

  useEffect(() => {
    if (sessionState.username && !isOpeningValuesWrited) {
      setIsOpeningValuesWrited(true);
      dispatch(changeUserSettingsValue({ name: 'name', value: sessionState.name }))
      dispatch(changeUserSettingsValue({ name: 'username', value: sessionState.username }))
      dispatch(changeUserSettingsValue({ name: 'email', value: sessionState.email }))
      dispatch(changeUserSettingsValue({ name: 'bio', value: sessionState.bio || '' }))
    }
  }, [sessionState]);



  const onInputFunc = e => {
    dispatch(changeUserSettingsValue({ name: e.target.id, value: e.target.value }));
  }

  const saveChanges = e => {
    dispatch(userSettingsFetch({ image: newProfileImage }));
    e.preventDefault();
  }


  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewProfileImage(e.target.files[0])
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setImage()
    }
  };

  useEffect(() => {
    if (userSettingsFetchState.error) {
      alertify.error("There is an error please try again. You are being directed.");
      setTimeout(()=>{
        dispatch(resetUserSettingsState());
        navigate('/'+sessionState.username);
      },3000);
    }
    if (userSettingsFetchState.data) {
      dispatch(setSessionState({user: userSettingsFetchState.data.body.userUpdate, token: userSettingsFetchState.data.body.token}));
      setCookie('access', userSettingsFetchState.data.body.refreshToken)
      alertify.success("Your informations were updated. You are being directed.");
      setTimeout(()=>{
        dispatch(resetUserSettingsState());
        navigate('/'+sessionState.username);
      },3000);
    }
  }, [userSettingsFetchState])



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
            <h1 className='text-center'>Informations</h1>
            <form onSubmit={saveChanges}>
              <div className='input-box'>
                {image ? <><img src={image} /></> :
                  <img alt={sessionState.username + ' profile image'} src={REACT_APP_IMAGES_URL + sessionState.profile_image} />
                }
                <Input multiple={false} onChange={handleImageChange} placeholder='Name' type="file" accept=".png, .jpg, .jpeg" />
              </div>
              <div className='input-box'>
                <label>Name</label>
                <Input onInput={onInputFunc} invalid={userSettingsValuesState.wrongInputs.indexOf('name') !== -1} id="name" defaultValue={sessionState.name} placeholder='Name' type="text" />
              </div>
              <div className='input-box'>
                <label>Username</label>
                <Input onInput={onInputFunc} invalid={userSettingsValuesState.wrongInputs.indexOf('username') !== -1} defaultValue={sessionState.username} placeholder='username' id='username' type="text" />
              </div>
              <div className='input-box'>
                <label>Email</label>
                <Input onInput={onInputFunc} invalid={userSettingsValuesState.wrongInputs.indexOf('email') !== -1} defaultValue={sessionState.email} placeholder='example@example.com' type="email" id="email" />
              </div>
              <div className='input-box'>
                <label>Biography: </label>
                <Input onInput={onInputFunc} defaultValue={sessionState.bio} placeholder='biography' id="bio" type='textarea' />
              </div>
              <div className="button-box">
                <Button color="primary" type="submit" disabled={!userSettingsValuesState.isReady || userSettingsFetchState.isLoading}>{userSettingsFetchState.isLoading ? <><Spinner /></> : 'Save'}</Button>
              </div>
              <div className='input-box text-center'>
                <Link to="/updatepassword">Change Password</Link>
              </div>
            </form>
          </Col>
          <Col md="3"></Col>
        </Row>

      </motion.div>
    </>
  )
}

export default UserSettings;