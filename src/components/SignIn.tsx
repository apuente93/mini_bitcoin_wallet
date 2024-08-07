import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { sendSignInLinkToEmail } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import '../styles/SignIn.css';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [resendEnabled, setResendEnabled] = useState(false);

  const handleLogin = async () => {
    const actionCodeSettings = {
      url: 'http://localhost:3000/callback',
      handleCodeInApp: true,
    };
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      setMessage('Check your inbox for a sign-in link, which is valid for 10 minutes. If you don’t receive it in 30 seconds, press resend to receive another link.');
      setResendEnabled(false);
      setTimeout(() => setResendEnabled(true), 30000);
    } catch (error: any) {
      if (error.code === 'auth/invalid-email') {
        setError('Incorrect email address');
      } else {
        setError(error.message || String(error));
      }
    }
  };

  useEffect(() => {
    if (message) {
      setResendEnabled(false);
      const timer = setTimeout(() => setResendEnabled(true), 30000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <Container className="sign-in-container">
      <div className="sign-in-logo">
        <img src="https://mma.prnewswire.com/media/2220870/AnchorWatch.jpg?p=publish" alt="Logo" />
      </div>
      {message ? (
        <div className="sign-in-message">
          <p>{message}</p>
          <Button onClick={handleLogin} className="sign-in-button" disabled={!resendEnabled}>
            Resend
          </Button>
        </div>
      ) : (
        <>
          <h2 className="sign-in-header">Sign In</h2>
          <p className="sign-in-text">Enter your AnchorWatch registered email.</p>
          <Form>
            <Form.Group>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="sign-in-input"
              />
            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}
            <Button onClick={handleLogin} className="sign-in-button">
              Send Link
            </Button>
          </Form>
        </>
      )}
    </Container>
  );
};

export default SignIn;
