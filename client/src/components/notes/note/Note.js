import React, { useEffect, useState } from 'react';
import './note.css';
import { motion } from 'framer-motion';
import { Row, Col, Card, CardBody, CardTitle, CardText, Input, Button, Spinner, Alert } from 'reactstrap';
import Left from '../../nav/left/Left';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { BiSolidEdit, BiSolidCommentDetail } from 'react-icons/bi';
import { BsFillBookmarksFill, BsBookmarks, BsTrash3Fill } from 'react-icons/bs';
import Top from '../../nav/top/Top';
import Comment from '../../comment/Comment';
import { useDispatch, useSelector } from 'react-redux';
import { getNoteFetch } from '../../../redux/reducers/notesSlice';
import { likeFetch } from '../../../redux/reducers/likeSlice';
import { setSessionOneThing, setSessionState } from '../../../redux/reducers/sessionSlice';
import { saveFetch } from '../../../redux/reducers/saveSlice';
import { deleteCommentFetch, newCommentFetch } from '../../../redux/reducers/commentSlice';
import EditNote from '../editnote/EditNote';
import alertify from 'alertifyjs';
import { deleteNoteFetch, resetDeleteNoteState } from '../../../redux/reducers/deleteNoteSlice';
const { REACT_APP_IMAGES_URL } = process.env;

const Note = () => {
  const [note, setNote] = useState(false);
  const [isIntervalRunning, setIsIntervalRunning] = useState(true);
  const dispatch = useDispatch();
  const { link } = useParams();
  const noteFetchState = useSelector(state => state.notes.forNoteFetch);
  const refreshTokenFetchState = useSelector(state => state.refreshToken);
  const navigate = useNavigate();

  useEffect(() => {
    setNote(noteFetchState.data ? noteFetchState.data : false);
    dispatch(getNoteFetch(link));
  }, [])

  useEffect(() => {
    let intervalId;

    if (isIntervalRunning) {
      intervalId = setInterval(() => {
        if (noteFetchState.data) {
          setNote(noteFetchState.data);
          setIsIntervalRunning(false);
          return () => clearInterval(intervalId);
        } else {
          if (noteFetchState.error) {
            if (noteFetchState.error.status === 401) {
              setTimeout(() => {
                navigate('/')
              }, 2000);
              return;
            }
          }
          dispatch(getNoteFetch(link));
        }
      }, 1000);
    }

    return () => clearInterval(intervalId);

  }, [noteFetchState]);


  return (
    <>
      {note && noteFetchState.data ?
        <NoteWrting value={noteFetchState.data.body.note} /> :
        noteFetchState.error ?
          noteFetchState.error.status === 401 ? <UnauthorizedPage /> :
            <><NotFoundedPage /></> :
          <><div className="text-center" style={{ fontSize: '3em', height: '50px' }}><Spinner style={{ width: '100px', height: '100px' }} /></div></>}
    </>
  )
}

const NotFoundedPage = () => {
  const navigate = useNavigate();
  setTimeout(() => {
    navigate('/');
  }, 2000)
  return (
    <div className='note-container'>
      <Row>
        <Col lg="3" xxl="2" className='left-col'><Left /></Col>
        <Col lg="9" xxl="10">
          <Top />
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
          >

            <Card>
              <CardBody>
                <h1 className='text-center'>Note is not founded</h1>
                <p className='text-center'>You are being directed</p>

              </CardBody>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  )
}

const UnauthorizedPage = () => {
  return (
    <div className='note-container'>
      <Row>
        <Col lg="3" xxl="2" className='left-col'><Left /></Col>
        <Col lg="9" xxl="10">
          <Top />
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
          >

            <Card>
              <CardBody>
                <h1 className='text-center'>This note is private</h1>
                <p className='text-center'>You are being directed</p>

              </CardBody>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  )
}


const NoteWrting = ({ value }) => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState('');
  const [buttonStatus, setButtonStatus] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [note, setNote] = useState(value);
  const sessionState = useSelector(state => state.session);
  const likeFetchState = useSelector(state => state.like);
  const saveFetchState = useSelector(state => state.save);
  const noteFetchState = useSelector(state => state.notes.forNoteFetch);
  const newCommentFetchState = useSelector(state => state.comment.new);
  const deleteCommentFetchState = useSelector(state => state.comment.delete);
  const deleteNoteFetchState = useSelector(state => state.deleteNote);
  const [isDeleteNote, setIsDeleteNote] = useState(false);
  const navigate = useNavigate();


  if (!note.liked) setNote({ ...note, liked: [] })


  useEffect(() => {
    if (noteFetchState.data) {
      setNote(noteFetchState.data.body.note);
    }
  }, [noteFetchState])

  const likeFunc = liked => {
    if (liked) {
      dispatch(likeFetch({ id: note._id, liked: 1 }));
      let likedFiltered = note.liked.filter(val => val !== sessionState._id);
      setNote({ ...note, liked: likedFiltered })
    } else {
      dispatch(likeFetch({ id: note._id, liked: 0 }));
      let updatedFiltered = [...note.liked, sessionState._id];
      setNote({ ...note, liked: updatedFiltered });
    }
  }

  const saveFunc = saved => {
    if (saved) {
      dispatch(saveFetch({ id: note._id, saved: 1 }));
      let savedFiltered = sessionState.saved.filter(val => val._id !== note._id);
      dispatch(setSessionOneThing({ name: 'saved', value: savedFiltered }));
    } else {
      dispatch(saveFetch({ id: note._id, saved: 0 }));
      let updatedFiltered = [...sessionState.saved, note];
      dispatch(setSessionOneThing({ name: 'saved', value: updatedFiltered }));
    }
  }



  useEffect(() => {
    if (likeFetchState.data && likeFetchState.data.note._id === note._id) setNote({ ...note, liked: likeFetchState.data.note.liked });
  }, [likeFetchState])

  useEffect(() => {
    if (saveFetchState.data) dispatch(setSessionState({ token: sessionState.token, user: saveFetchState.data.user }))
  }, [saveFetchState]);


  const commentInput = e => {
    setComment(e.target.value);
  }

  useEffect(() => {
    if (comment.length > 0) setButtonStatus(true);
    else setButtonStatus(false);
  }, [comment])


  const commentSend = () => {
    if (comment === '') return;
    dispatch(newCommentFetch({ text: comment, id: note._id }))
  }

  useEffect(() => {
    if (newCommentFetchState.data) {
      setComment('');
      setNote(newCommentFetchState.data.body.editedNote);
    }
    if (newCommentFetchState.error) {
      setAlertMessage("There is a problem please try again.");
      setTimeout(() => void (setAlertMessage('')), 3000);
    }
  }, [newCommentFetchState])


  const commentDelete = id => {
    dispatch(deleteCommentFetch({ id, noteId: note._id }));
    let editedComment = note.comment.filter(e => e._id !== id);
    setNote({ ...note, comment: editedComment })
  }

  useEffect(() => {
    if (deleteCommentFetchState.error) {
      setAlertMessage("There is a problem please try again.");
      setTimeout(() => void (setAlertMessage('')), 3000);
    }
    if (deleteCommentFetchState.data) {
      setNote(deleteCommentFetchState.data.note);
    }
  }, [deleteCommentFetchState])

  const editButtonFunc = () => {
    setIsEditing(true);
  }

  const deleteButtonFunc = () => {
    alertify.confirm("Your note will be deleted, are you sure?", () => void (setIsDeleteNote(true)))
  }

  useEffect(() => {
    if (isDeleteNote) {
      dispatch(deleteNoteFetch({ link: note.link }));
    }
  }, [isDeleteNote])

  useEffect(() => {
    if (deleteNoteFetchState.error) {
      setAlertMessage("There is a problem please try again.");
      setTimeout(() => void (setAlertMessage('')), 3000);
    }
    if (deleteNoteFetchState.data) {
      alertify.success('The note was deleted.\nYou are being directed');
      dispatch(resetDeleteNoteState());
      setTimeout(() => {
        navigate('/' + sessionState.username);
      }, 1000)
    }
  }, [deleteNoteFetchState])

  return (
    <>
      <div className='note-container'>
        <Row>
          <Col lg="3" xxl="2" className='left-col'><Left /></Col>
          <Col lg="9" xxl="10">
            <Top />
            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {isEditing ?
                <EditNote note={note} setNote={setNote} setIsEditing={setIsEditing} />
                : noteFetchState.isLoading && !note ?
                  <><div className="text-center" style={{ fontSize: '3em', height: '50px' }}><Spinner style={{ width: '100px', height: '100px' }} /></div></> :
                  <motion.div
                    initial={{ opacity: 0, y: -100 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card>
                      <CardBody>
                        <div className='note-title-box'>
                          <Link className='user-box' to={`/${note.userid.username}`}>
                            <CardTitle>
                              <img alt="" src={REACT_APP_IMAGES_URL + note.userid.profile_image} /> {value.userid.username}
                            </CardTitle>
                          </Link>
                          {note.userid._id === sessionState._id ? <>
                            <span onClick={deleteButtonFunc} style={{ fontSize: '1.4rem', padding: '0.15em 0.4em', cursor: 'pointer' }} className='text-danger'><BsTrash3Fill /></span>
                            <span onClick={editButtonFunc} style={{ fontSize: '1.6rem', padding: '0em 0.4em', cursor: 'pointer' }}><BiSolidEdit /></span>
                          </> : ''}
                        </div>
                        <CardText>
                          {note.html ? <div dangerouslySetInnerHTML={{ __html: note.html }} /> : note.text}
                        </CardText>
                        <br />
                        <div className="relations">
                          <div className="flex-space"></div>
                          <div className="like-box">
                            <span style={{ fontSize: '0.7em', marginRight: '0.3em' }}>{note.liked.length}</span>
                            {sessionState.username && note.liked.indexOf(sessionState._id) !== -1 ? <AiFillHeart title="unlike" onClick={() => likeFunc(1)} className="liked" /> : <AiOutlineHeart title="like" onClick={() => likeFunc(0)} />}
                          </div>
                          <div className="comment-box">
                            <BiSolidCommentDetail />
                          </div>
                          <div className="save-box">
                            {sessionState.username && sessionState.saved.find(e => e._id === note._id) ? <BsFillBookmarksFill title="unsave" className="liked" onClick={() => saveFunc(1)} /> : <BsBookmarks title="save" onClick={() => saveFunc(0)} />}
                          </div>
                        </div>
                        <br />
                        <div style={{ clear: 'both' }}></div>
                        {alertMessage ? <>
                          <div className='messages-box text-center'>
                            <Alert color="danger" className='text-left text-dark'>
                              {alertMessage}
                            </Alert>
                          </div>
                        </> : ''}
                        <div className='new-comment-box'>
                          <Input placeholder='New comment' value={comment} onInput={commentInput} /><Button disabled={!buttonStatus} onClick={commentSend} color="light">{newCommentFetchState.isLoading ? <><Spinner /></> : "Send"}</Button>
                        </div>
                        <div className='note-comments-box'>
                          {note.comment ? note.comment.map((element, key) => {
                            return (
                              <>
                                <Comment commentDelete={commentDelete} key={key} value={element} />
                              </>
                            )
                          }) : ''}
                        </div>

                      </CardBody>
                    </Card>
                  </motion.div>}
            </motion.div>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Note;