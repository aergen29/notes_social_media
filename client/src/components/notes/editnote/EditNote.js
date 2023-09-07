import React, { useState, useEffect } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Alert, Button, Spinner, Card } from 'reactstrap';
import { motion } from 'framer-motion';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import { editNoteFetch, resetEditNoteState, setEditNoteValues } from "../../../redux/reducers/editNoteSlice";
import { useDispatch, useSelector } from "react-redux";
import { ImCancelCircle } from 'react-icons/im'

const EditNote = ({ note, setIsEditing, setNote }) => {
  const [value, setValue] = useState(note.html);
  const [alertMessage, setAlertMessage] = useState(null);
  const [checked, setChecked] = useState(false);
  const [buttonStatus, setButtonStatus] = useState(false);
  const dispatch = useDispatch();
  const editNoteState = useSelector(state => state.editNote.values);
  const editNoteFetchState = useSelector(state => state.editNote.forFetch)


  useEffect(() => {
    let tempDiv = document.createElement('div');
    tempDiv.innerHTML = value;
    let text = tempDiv.innerText;
    dispatch(setEditNoteValues([value, text, checked]))
  }, [value, checked])

  useEffect(() => {
    if (editNoteFetchState.error) {
      typeof editNoteFetchState.error.data === "string" ? setAlertMessage({ status: false, message: editNoteFetchState.error.data }) : setAlertMessage(editNoteFetchState.error.data);
      setTimeout(() => {
        dispatch(resetEditNoteState());
        setIsEditing(false);
      }, 3000)
    }
    if (editNoteFetchState.data) {
      setAlertMessage({ status: true })
      setTimeout(() => {
        setNote(editNoteFetchState.data.note);
        dispatch(resetEditNoteState());
        setIsEditing(false);
      }, 3000)
    }
    setTimeout(() => {
      setAlertMessage(null)
    }, 3000)
  }, [editNoteFetchState])


  const saveNote = () => {
    setButtonStatus(true);
    dispatch(editNoteFetch({ link: note.link }));
  }

  const cancelEditing = () => {
    setIsEditing(false);
  }

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  }
  return (
    <>
      <motion.div
        initial={{
          opacity: 0,
          y: 30
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="new-note-container">
        <Card style={{ padding: '2em' }}>
          <div style={{ fontSize: "1.6em", display: "flex", justifyContent: "flex-end", padding: "0em 0.255em" }}><ImCancelCircle onClick={cancelEditing} /></div>
          {alertMessage ? <div>
            <Alert color={alertMessage.status === true ? "success" : "danger"}>
              {alertMessage.status === true ? <>Note is saved successfully. You are being directed. </> : <>{alertMessage.message}</>}
            </Alert>
          </div> : ''}
          <div className='checkbox-box'>
            <FormGroup className={!checked ? 'didntcheck' : ''}>
              <FormControlLabel control={<Checkbox defaultChecked={note.accessibility === 'private'} onClick={() => setChecked(!checked)} />} label="Private" />
            </FormGroup>
          </div>

          <ReactQuill value={value} onChange={setValue} modules={modules} />
          <div className='buttons-box'>
            <Button color="outline-primary" disabled={!editNoteState.isReady || buttonStatus} onClick={saveNote}>{editNoteFetchState.isLoading ? <Spinner /> : 'Save'}</Button>
          </div>
        </Card>
      </motion.div>
    </>
  )
}

export default EditNote;