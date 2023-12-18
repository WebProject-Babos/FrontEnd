import React, { useContext, useEffect, useState } from 'react';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth'; // Adjust the import path as necessary
import axios from 'axios';

export default function Header() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [nickName, setNickName] = useState('');
  const [id, setId] = useState('');
  const authToken = localStorage.getItem("Authorization");
  

  const handleLogout = () => {
    logout();
    navigate('/');
    alert("Logged Out!");
  };

  const getUserInfo = async () => {
    try{
      const userInfo = await axios.get(`${process.env.REACT_APP_API_URL}/members/me`, 
      { headers: { Authorization: `${authToken}` } });
      setNickName(userInfo.data.nickname);
      setId(userInfo.data.id);
    }
    catch(error){
      console.error("Error fetching user info:", error);
    }
  }

  useEffect(() => {
    getUserInfo();
  },[]);

  return (
    <Navbar
      expand="lg"
      fixed="top"
      style={{
        backgroundSize: '0',
        height: '70px',
        backgroundColor: '#50CB93',
        paddingLeft: '5%',
        paddingRight: '0',
      }}
    >
      <Container fluid className="p-0">
        <Navbar.Brand
          href="/"
          style={{ color: 'black', display: 'flex', alignItems: 'center' }}
        >
          <span>PKU Community</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ marginRight: '10%' }} />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto" style={{ backgroundColor: '#50CB93' }}>
            <Nav.Link className="text text-center" href="/">
              Home
            </Nav.Link>
            <Nav.Link className="text text-center" href="/community">
              Community
            </Nav.Link>
            <Nav.Link className="text text-center" href="/messages">
              Messages
            </Nav.Link>
          </Nav>
          
          <div className="text text-center" style={{ marginRight: '5%', backgroundColor: '#50CB93' }}>
            {isLoggedIn ? (
              <>
                {`Welcome, ${nickName}! Your Website ID is ${id}.  `}
                <Button
                  className="text text-center"
                  variant="danger"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <p className="d-inline me-3 text text-center">Please Log in.</p>
                <Button
                  className="text text-center"
                  variant="success"
                  href="/login"
                >
                  Login
                </Button>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
