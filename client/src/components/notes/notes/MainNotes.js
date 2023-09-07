import React, { useEffect, useState } from "react";
import MiniNote from "../mininote/MiniNote";
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { getNotesFetch, setNotesState } from "../../../redux/reducers/notesSlice";
import { Spinner } from "reactstrap";

const MainNotes = () => {
  const [isIntervalRunning, setIsIntervalRunning] = useState(true);
  const dispatch = useDispatch();
  const [cookies, setCookie] = useCookies(['access']);
  const sessionState = useSelector(state => state.session);
  const refreshTokenFetchState = useSelector(state => state.refreshToken);
  const notesState = useSelector(state => state.notes.values);
  const notesFetchState = useSelector(state => state.notes.forFetch);
  const navigate = useNavigate();


  // I wrote this because I don't know refresh token when getting the access token 
  useEffect(() => {
    //this code writed by chatgpt

    let intervalId;

    if (isIntervalRunning) {
      //isIntervalRunning is true, this setInterval is running 
      intervalId = setInterval(() => {
        if (notesFetchState.data) {
          setIsIntervalRunning(false);
          return;
        } else {
          //if refrestokenfetch has no error and session has username these are getting notes  
          if ((refreshTokenFetchState.error || !cookies.access) && !sessionState.username) navigate('/login');
          else {
            dispatch(getNotesFetch());
          }
        }
      }, 1000);
    }

    return () => clearInterval(intervalId);
    
  }, [notesFetchState]);

  if (sessionState.username === '') return <></>;
  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.05 } }
        }}>
        {notesFetchState.isLoading || !notesFetchState.data ?
          <><div className="text-center" style={{ fontSize: '3em', height: '50px' }}><Spinner style={{ width: '100px', height: '100px' }} /></div></> :
          notesFetchState.data.body.allNotes.length === 0 ?
            <><h6 className="text-center">Here is empty. You can follow someone.</h6></> :
            notesFetchState.data.body.allNotes.map((element, key) => {
              return element.text ? <MiniNote value={element} key={key} />:''
            })}

      </motion.div>
    </>
  )
}

export default MainNotes;