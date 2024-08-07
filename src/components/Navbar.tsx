// src/components/Navbar.tsx
import React from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { useAuth } from './AuthProvider';
import { Link, useNavigate } from 'react-router-dom';

const AppNavbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <Navbar style={{ backgroundColor: '#000' }} variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
            <img
              src="https://pbs.twimg.com/profile_images/1661376637424762881/i8qOfZ_L_400x400.jpg"
              alt="AnchorWatch Logo"
              style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }}
            />
            AnchorWatch
          </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {currentUser && (
              <>
                <i className="bi bi-person-circle" style={{ fontSize: '1.5rem', color: '#fff', marginRight: '10px' }}></i>
                <Button variant="outline-light" onClick={handleLogout}>
                  Sign Out
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
