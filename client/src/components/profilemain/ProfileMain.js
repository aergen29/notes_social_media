import './profilemain.css';
import { Row, Col } from 'reactstrap';
import { Route, Routes } from 'react-router-dom';
import Left from '../nav/left/Left';
import Profile from '../profile/Profile';
import UserSettings from '../usersettings/UserSettings';
import NewNote from '../newnote/NewNote';
import Top from '../nav/top/Top'
import UpdatePassword from '../updatepassword/UpdatePassword';

const ProfileMain = () => {
  return (
    <>
      <div className='profilemain-container'>
        <Row>
          <Col lg="3" xxl="2" className='left-col'><Left /></Col>
          <Col lg="9" xxl="10">
            <Routes>
              <Route
                path="/settings"
                element={
                  <>
                    <UserSettings />
                  </>
                } />
              <Route
                path="/updatepassword"
                element={
                  <>
                    <UpdatePassword />
                  </>
                } />
              <Route
                path="/new"
                element={
                  <>
                    <Top title="New Note" />
                    <NewNote />
                  </>
                } />
              <Route
                path="/:username"
                element={
                  <>
                    <Profile />
                  </>
                } />
            </Routes>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default ProfileMain;