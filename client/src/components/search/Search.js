import './search.css';
import React, { useEffect, useState } from 'react';
import { Input, Button, Spinner } from 'reactstrap';
import { AiOutlineSearch } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { mostUsersFetch } from '../../redux/reducers/mostUsersSlice';
import { resetSearchValues, searchFetch, setSearchValues } from '../../redux/reducers/searchSlice';
const {REACT_APP_IMAGES_URL} = process.env;


const Search = () => {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const [cookies, setCookie] = useCookies(['access']);
  const sessionState = useSelector(state => state.session);
  const refreshTokenFetchState = useSelector(state => state.refreshToken);
  const mostUsersState = useSelector(state => state.mostUsers.values);
  const mostUsersFetchState = useSelector(state => state.mostUsers.forFetch);
  const searchFetchState = useSelector(state => state.search.forFetch);
  const searchState = useSelector(state => state.search.values);
  const searchStateInput = useSelector(state => state.search.values.username);
  const navigate = useNavigate();


  useEffect(() => {
    if ((refreshTokenFetchState.error || !cookies.access) && !sessionState.username) navigate('/login');
    if (refreshTokenFetchState.data || sessionState.username) {
      dispatch(mostUsersFetch());
    }
  }, [])
  useEffect(() => {
    if (!searchState.users || searchState.username === '') setUsers(mostUsersState.users)
    else setUsers(searchState.users);
  }, [mostUsersState, searchState])

  useEffect(() => {
    if (searchState.username !== '') {
      dispatch(searchFetch());
    }
  }, [searchStateInput])


  const onInputFunc = e => {
    if (e.target.value === '') dispatch(resetSearchValues());
    else dispatch(setSearchValues(e.target.value));
  }


  if (sessionState.username === '') return <></>;
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        className='search-container'>
        <div className='input-box'>
          <Input
            onInput={onInputFunc}
            placeholder='Search'
          />
          <button className='search-icon-box'><AiOutlineSearch /> </button>
        </div>
        <div className='founded-box'>
          {mostUsersFetchState.isLoading || searchFetchState.isLoading ?
            <><div className="text-center" style={{ fontSize: '3em', height: '50px', marginTop:"30px" }}><Spinner style={{ width: '100px', height: '100px' }} /></div></> :
            users.length !== 0 ? users.map((e, key) => {
              return (
                <div key={key} className='user-box'>
                  <Link to={`/${e.username}`}>
                    <img alt="" src={REACT_APP_IMAGES_URL+e.profile_image} /> {e.name}
                  </Link>
                </div>
              )
            }) :
              <div className='user-box non-border'><h2 className='text-center w-100'>User is not founded</h2></div>}
        </div>
      </motion.div>
    </>
  );
}

export default Search;