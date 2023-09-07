import { Link, useParams } from 'react-router-dom';
import './profile.css';
import { Button, Col, Row, Spinner } from 'reactstrap';
import values from '../../a.json';
import MiniNote from '../notes/mininote/MiniNote';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { setVisitState, visitFetch } from '../../redux/reducers/visitSlice';
import { getNotesProfileFetch } from '../../redux/reducers/notesSlice';
import { followFetch, resetFollowState, unfollowFetch } from '../../redux/reducers/followSlice';
import { setSessionState } from '../../redux/reducers/sessionSlice';
const { REACT_APP_IMAGES_URL } = process.env;


const Profile = () => {
  const { username } = useParams();
  const dispatch = useDispatch();
  const visitState = useSelector(state => state.visit.values);
  const sessionState = useSelector(state => state.session);
  const visitFetchState = useSelector(state => state.visit.forFetch);
  const getNotesProfileFetchState = useSelector(state => state.notes.forProfileFetch);
  const refreshTokenFetchState = useSelector(state => state.refreshToken);
  const followFetchState = useSelector(state => state.follow.follow)
  const unfollowFetchState = useSelector(state => state.follow.unFollow)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    dispatch(setVisitState(username))
  }, [username])

  useEffect(() => {
    dispatch(visitFetch());
  }, [visitState])

  useEffect(() => {
    if (visitFetchState.data && !refreshTokenFetchState.isLoading) {
      dispatch(getNotesProfileFetch(username));
      setProfile(visitFetchState.data.body.user)
    }
  }, [visitFetchState, refreshTokenFetchState])

  const followFunc = () => {
    dispatch(followFetch({ username: profile.username }))
  }
  const unfollowFunc = () => {
    dispatch(unfollowFetch({ username: profile.username }))
  }

  useEffect(() => {
    if (followFetchState.data) {
      dispatch(setSessionState({ token: sessionState.token, user:followFetchState.data.body.editedFollower }));
    }
    if (unfollowFetchState.data) {
      dispatch(setSessionState({ token: sessionState.token, user:unfollowFetchState.data.body.editedFollower }));
    }
  }, [followFetchState,unfollowFetchState])

  useEffect(() => {
    if (followFetchState.data) {
      setProfile(followFetchState.data.body.editedFollowed);
      dispatch(resetFollowState());
    }
    if (unfollowFetchState.data) {
      setProfile(unfollowFetchState.data.body.editedFollowed);
      dispatch(resetFollowState());
    }
  }, [sessionState])



  if (visitFetchState.isLoading) return <><div className="text-center" style={{ fontSize: '3em', height: '50px', marginTop: "30px" }}><Spinner style={{ width: '100px', height: '100px' }} /></div></>;
  return (
    <>
      {
        profile ?
          <div className='profile-container'>
            <div className='profile-background'></div>
            <Row className='image-name-follow-row'>
              <Col md="6" className='image-name-container'>
                <div className='image-box'>
                  <img src={REACT_APP_IMAGES_URL + profile.profile_image} />
                </div>
                <div className='name-box'>
                  <h3>{profile.name}</h3>
                  <h6>{profile.username}</h6>
                </div>
              </Col>
              <Col md="6" className='follow-container'>
                <div className='note-count-box'>
                  <strong>{getNotesProfileFetchState.data ? getNotesProfileFetchState.data.body.notes.length : ''}</strong><br />
                  <span>Notes</span>
                </div>
                <div className='follow-count-box'>
                  <strong>{profile.follower.length}</strong><br />
                  <span>Followers</span>
                </div>
                <div className='follower-count-box'>
                  <strong>{profile.follow.length}</strong><br />
                  <span>Following</span>
                </div>
              </Col>
            </Row>
            <Row className='bio-row'>
              <p>{profile.bio}</p>
              <div className='follow-box'>
                {sessionState.username !== profile.username
                  ? sessionState.follow.indexOf(profile._id) === -1
                    ? <Button onClick={followFunc} color="outline-primary">{followFetchState.isLoading?<><Spinner/></>:'Follow'}</Button>
                    : <Button onClick={unfollowFunc} color="outline-danger">{unfollowFetchState.isLoading?<><Spinner/></>:'Unfollow'}</Button>
                  : <><Link to="/settings"><Button color="outline-warning">Edit</Button></Link></>}
              </div>
            </Row>
            <Row className='notes-row'>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.05 } }
                }}>

                {
                  getNotesProfileFetchState.data ? getNotesProfileFetchState.data.body.notes.map((element, key) => {
                    return <MiniNote value={element} key={key} />
                  }) : ''
                }

              </motion.div>

            </Row>
          </div> : <div className='profile-container'><h1 className='text=center'>User is not Founded</h1></div>
      }
    </>
  )
}

export default Profile;