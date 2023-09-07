import { Link, useNavigate } from 'react-router-dom';
import './right.css';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { mostUsersFetch } from '../../../redux/reducers/mostUsersSlice';
import { useEffect } from 'react';
const {REACT_APP_IMAGES_URL} = process.env;

const Right = () => {
  const dispatch = useDispatch();
  const [cookies, setCookie] = useCookies(['access']);
  const sessionState = useSelector(state => state.session);
  const refreshTokenFetchState = useSelector(state => state.refreshToken);
  const mostUsersState = useSelector(state => state.mostUsers.values);
  const navigate = useNavigate();
  useEffect(() => {
    if (refreshTokenFetchState.error || !cookies.access) navigate('/login');
    if(Boolean(refreshTokenFetchState.data || sessionState.username) && mostUsersState.users.length === 0){
      dispatch(mostUsersFetch());
    }
  }, [refreshTokenFetchState])

  if (Boolean(sessionState.username === '' || refreshTokenFetchState.isLoading)  && mostUsersState.users.length === 0) return <></>;
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className='right-container'>
        {mostUsersState.users.map((e, key) => {
          return (
            <div key={key} className='user-box'>
              <Link to={`/${e.username}`}>
                <img alt="" src={REACT_APP_IMAGES_URL+e.profile_image} /> {e.name}
              </Link>
            </div>
          )
        })}
      </motion.div>
    </>
  )
}

export default Right;