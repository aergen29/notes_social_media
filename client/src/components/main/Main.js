import { Row, Col } from 'reactstrap';
import './main.css';
import Left from '../nav/left/Left';
import Top from '../nav/top/Top';
import MainNotes from '../notes/notes/MainNotes';
import Right from '../nav/right/Right';
import { useLocation, Route, Routes } from 'react-router-dom';
import Search from '../search/Search';
import Saved from '../saved/Saved';
import ProfileMain from '../profilemain/ProfileMain';


const Main = () => {
  const location = useLocation();
  const isKnownPath =
    location.pathname === '/' ||
    location.pathname === '/search' ||
    location.pathname === '/saved';
  return (
    <>
      {isKnownPath ? (
        <>
          <div className='main-container'>
            <Row>
              <Col lg="3" xxl="2" className='left-col'><Left /></Col>
              <Col lg="6" xxl="8">
                <Routes>
                  <Route
                    path="/"
                    element={
                      <>
                        <Top />
                        <MainNotes />
                      </>
                    } />
                  <Route
                    path="/search"
                    element={
                      <>
                        <Top />
                        <Search />
                      </>
                    } />
                  <Route
                    path="/saved"
                    element={
                      <>
                        <Top title="SAVED" />
                        <Saved />
                      </>
                    } />
                </Routes>
              </Col>
              <Col lg="3" xxl="2"><Right /></Col>
            </Row>
          </div>
        </>
      ) : <ProfileMain />}

    </>
  )
}

export default Main;