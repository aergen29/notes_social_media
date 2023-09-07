import './left.css';
import React, { useState } from "react";
import { Link, useLocation } from 'react-router-dom';
import { ListGroup, ListGroupItem, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { BsFillBookmarksFill } from 'react-icons/bs'
import { FaSearch } from 'react-icons/fa';
import { HiHome } from 'react-icons/hi';
import { GiHamburgerMenu } from 'react-icons/gi';
import { AiOutlinePlusSquare } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
const { REACT_APP_IMAGES_URL } = process.env;


const Left = () => {
  const [token, setToken, removeToken] = useCookies(['access']);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownOpenTwo, setDropdownOpenTwo] = useState(false);
  const toggle = () => setDropdownOpen(!dropdownOpen);
  const toggleTwo = () => setDropdownOpenTwo(!dropdownOpenTwo);
  const sessionState = useSelector(state => state.session);

  const logoutFunc = () => {
    removeToken("access");
    window.location.reload(true);
  }

  return (
    <>
      <div className='left-container'>
        {sessionState.username ?
          <>
            <ListGroup className='small-profile-container'>
              <ListGroupItem className='small-profile'>
                <Link to="/29apo29"><img alt={sessionState.username + ' profile image'} src={REACT_APP_IMAGES_URL + sessionState.profile_image}></img></Link>
                <Link style={{ marginLeft: '5px' }} to={`/${sessionState.username}`}> {sessionState.username}</Link>
                <Dropdown nav isOpen={dropdownOpen} toggle={toggle}>
                  <DropdownToggle nav>
                    <GiHamburgerMenu />
                  </DropdownToggle>
                  <DropdownMenu>
                    <Link to='/29apo29'><DropdownItem>Profile</DropdownItem></Link>
                    <Link to="/settings"><DropdownItem>Settings</DropdownItem></Link>
                    <DropdownItem onClick={logoutFunc} style={{ color: 'red' }}>Log out</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </ListGroupItem>
            </ListGroup>
            <ListGroup className="menu-items-container">
              <Dropdown className='menu-items mobile-profile-box' nav isOpen={dropdownOpenTwo} toggle={toggleTwo}>
                <DropdownToggle nav>
                  <img alt={sessionState.username + ' profile image'} src={REACT_APP_IMAGES_URL + sessionState.profile_image}></img>
                </DropdownToggle>
                <DropdownMenu>
                  <Link to={sessionState.username}><DropdownItem>Profile</DropdownItem></Link>
                  <Link to="/settings"><DropdownItem>Settings</DropdownItem></Link>
                  <span onClick={logoutFunc} ><DropdownItem style={{ color: 'red' }}>Log out</DropdownItem></span>
                </DropdownMenu>
              </Dropdown>
              <Link to="/">
                <ListGroupItem className='menu-items'><HiHome /> <span>Home</span></ListGroupItem>
              </Link>
              <Link to="/new">
                <ListGroupItem className='menu-items'><AiOutlinePlusSquare /> <span>New Note</span></ListGroupItem>
              </Link>
              <Link to="/search">
                <ListGroupItem className='menu-items'><FaSearch /> <span>Search</span></ListGroupItem>
              </Link>
              <Link to="/saved">
                <ListGroupItem className='menu-items'><BsFillBookmarksFill /> <span>Saved</span></ListGroupItem>
              </Link>
            </ListGroup>
          </> :
          <><Link to="/login" style={{ textDecoration: 'none' }} className='text-center text-primary'><h3>Login</h3></Link></>}
      </div>
    </>
  );
}

export default Left;