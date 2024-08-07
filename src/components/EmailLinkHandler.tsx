// src/components/EmailLinkHandler.tsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { signInWithEmailLink, isSignInWithEmailLink } from 'firebase/auth';
import { useAuth } from './AuthProvider';
import { Container, Spinner } from 'react-bootstrap'; // Import Spinner

const EmailLinkHandler: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  useEffect(() => {
    const handleEmailLinkSignIn = async () => {
      const email = window.localStorage.getItem('emailForSignIn');
      if (!email) return navigate('/');

      if (isSignInWithEmailLink(auth, window.location.href)) {
        try {
          const result = await signInWithEmailLink(auth, email, window.location.href);
          setCurrentUser(result.user); // Ensure the current user is updated
          window.localStorage.removeItem('emailForSignIn');
          navigate('/dashboard');
        } catch (error) {
          console.error('Error signing in with email link:', error);
        }
      }
    };
    handleEmailLinkSignIn();
  }, [location, navigate, setCurrentUser]);

  return (
    <Container className="center-spinner">
      <Spinner animation="border" />
    </Container>
  );
};

export default EmailLinkHandler;
