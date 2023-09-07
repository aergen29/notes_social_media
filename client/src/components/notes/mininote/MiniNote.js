import { Card, CardBody, CardTitle, CardText } from "reactstrap";
import './mininote.css';
import { Link } from "react-router-dom";
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { BsFillBookmarksFill, BsBookmarks } from 'react-icons/bs';
import { BiSolidCommentDetail } from 'react-icons/bi';
import { motion } from "framer-motion"
import { useDispatch, useSelector } from "react-redux";
import { likeFetch } from "../../../redux/reducers/likeSlice";
import { useEffect, useState } from "react";
import { setSessionOneThing, setSessionState } from "../../../redux/reducers/sessionSlice";
import { saveFetch } from "../../../redux/reducers/saveSlice";
const { REACT_APP_IMAGES_URL } = process.env;

const MiniNote = ({ value }) => {
  const [note, setNote] = useState(value);
  const likeFetchState = useSelector(state => state.like);
  const saveFetchState = useSelector(state => state.save);
  const sessionState = useSelector(state => state.session);
  const dispatch = useDispatch();

  useEffect(() => {
    setNote(value);
  }, [value])

  if (!note.liked) setNote({ ...note, liked: [] })


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
      dispatch(setSessionOneThing({ name: 'saved', value: savedFiltered }))
    } else {
      dispatch(saveFetch({ id: note._id, saved: 0 }));
      let updatedFiltered = [...sessionState.saved, note];
      dispatch(setSessionOneThing({ name: 'saved', value: updatedFiltered }))
    }
  }

  useEffect(() => {
    if (likeFetchState.data && likeFetchState.data.note._id === note._id) setNote({ ...note, liked: likeFetchState.data.note.liked });
    if (likeFetchState.error && likeFetchState.data.note._id === note._id) setNote({ ...note, liked: likeFetchState.data.note.liked });
  }, [likeFetchState]);

  useEffect(() => {
    if (saveFetchState.data) dispatch(setSessionState({ token: sessionState.token, user: saveFetchState.data.user }))
  }, [saveFetchState]);

  return (
    <>
      <motion.div className="mini-note-container"
        variants={{
          hidden: {
            scale: 0.9,
            y: 10,
            opacity: 0
          },
          visible: {
            scale: 1,
            y: 0,
            opacity: 1
          }
        }}>
        <Card>
          <CardBody>
            <Link className="note-link" to={`/note/${note.link}`}>/{note.link}</Link>
            <CardText>
              {note.text.length > 60 ? `${note.text.slice(0, 160)}...` : note.text}
            </CardText>
            <br />
            <div className="relations">
              <Link to={`/${note.userid.username}`}>
                <CardTitle>
                  <img alt="" src={REACT_APP_IMAGES_URL + note.userid.profile_image} /> {note.userid.username}
                </CardTitle>
              </Link>
              <div className="flex-space"></div>
              <div className="like-box">
                <span style={{fontSize:'0.7em',marginRight:'0.3em'}}>{note.liked.length}</span>
                {sessionState.username && note.liked.indexOf(sessionState._id) !== -1 ? <AiFillHeart title="unlike" className="liked" onClick={() => likeFunc(1)} /> : <AiOutlineHeart title="like" onClick={() => likeFunc(0)} />}
              </div>
              <div className="comment-box">
                <BiSolidCommentDetail />
              </div>
              <div className="save-box">
                {sessionState.username && sessionState.saved.find(e => e._id === note._id) ? <BsFillBookmarksFill title="unsave" onClick={() => saveFunc(1)} /> : <BsBookmarks title="save" onClick={() => saveFunc(0)} />}
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </>
  )
}

export default MiniNote;