import React, { useEffect } from 'react';
import MiniNote from '../notes/mininote/MiniNote';
import { motion } from 'framer-motion';
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Saved = () => {
  const [cookies, setCookie] = useCookies(['access']);
  const sessionState = useSelector(state => state.session);
  const refreshTokenFetchState = useSelector(state => state.refreshToken);
  const navigate = useNavigate();
  useEffect(() => {
    if ((refreshTokenFetchState.error || !cookies.access) && !sessionState.username) navigate('/login');
  }, [refreshTokenFetchState])

  return (
    <>{ sessionState.username?
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.05 } }
        }}>
        {sessionState.username && sessionState.saved.map((element, key) => {
          return <MiniNote value={element} key={key} />
        })}
      </motion.div>
      :
      <></>}
    </>
  )
}

export default Saved;