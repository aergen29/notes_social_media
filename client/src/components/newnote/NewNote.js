import './newnote.css'
import React, { useState, useEffect } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Alert, Button, Spinner } from 'reactstrap';
import { motion } from 'framer-motion';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { newNoteFetch, resetNewNoteState, setNewNoteValues } from '../../redux/reducers/newNoteSlice';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material'


const NewNote = () => {
  const dispatch = useDispatch();
  const [alertMessage, setAlertMessage] = useState(null);
  const [buttonStatus, setButtonStatus] = useState(false);
  const [value, setValue] = useState('');
  const [cookies, setCookie] = useCookies(['access']);
  const sessionState = useSelector(state => state.session);
  const refreshTokenFetchState = useSelector(state => state.refreshToken);
  const newNoteState = useSelector(state => state.newNote.values);
  const newNoteFetchState = useSelector(state => state.newNote.forFetch);
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    if ((refreshTokenFetchState.error || !cookies.access) && !sessionState.username) navigate('/login');
  }, [refreshTokenFetchState])

  useEffect(() => {
    let tempDiv = document.createElement('div');
    tempDiv.innerHTML = value;
    let text = tempDiv.innerText;
    dispatch(setNewNoteValues([value, text, checked]))
  }, [value, checked])

  const saveNote = () => {
    setButtonStatus(true);
    dispatch(newNoteFetch());
  }

  useEffect(() => {
    if (newNoteFetchState.error){
      typeof newNoteFetchState.error.data === "string" ? setAlertMessage({ status: false, message: newNoteFetchState.error.data }) : setAlertMessage(newNoteFetchState.error.data);
      setTimeout(()=>{
        dispatch(resetNewNoteState());
        navigate(`/${sessionState.username}`);
      },5000)
    }
    if(newNoteFetchState.data){
      setAlertMessage({ status: true})
      setTimeout(()=>{
        dispatch(resetNewNoteState());
        navigate(`/${sessionState.username}`);
      },5000)
    }
    setTimeout(()=>{
      setAlertMessage(null)
    },4000)
  }, [newNoteFetchState])




  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link'],
      ['clean']
    ],
  }
  if (sessionState.username === '') return <></>;
  return (
    <>
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.8,
          y: 30
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0
        }}
        className="new-note-container">
        {alertMessage ? <div>
          <Alert color={alertMessage.status === true ? "success" : "danger"}>
            {alertMessage.status ? <>Note is saved successfully. You are being directed. </> : <>{alertMessage.message}</>}
          </Alert>
        </div>:''}
        <div className='checkbox-box'>
          <FormGroup className={!checked ? 'didntcheck' : ''}>
            <FormControlLabel control={<Checkbox onClick={() => setChecked(!checked)} />} label="Private" />
          </FormGroup>
        </div>

        <ReactQuill value={value} onChange={setValue} modules={modules} />
        <div className='buttons-box'>
          <Button color="primary" disabled={!newNoteState.isReady || buttonStatus} onClick={saveNote}>{newNoteFetchState.isLoading ? <Spinner /> : 'Save'}</Button>
          <Button color="danger" onClick={() => setValue('')}>Clear</Button>
        </div>
      </motion.div>
    </>
  )
}

export default NewNote;