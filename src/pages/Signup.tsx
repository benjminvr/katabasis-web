
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from '@emotion/styled';

// Reuse the styled components from Login
const SignupContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
              url('/images/underwater-fantasy-preview.png') no-repeat center center fixed;
  background-size: cover;
  image-rendering: pixelated;
`;

const SignupBox = styled.div`
  background: rgba(0, 0, 20, 0.8);
  padding: 2rem;
  border-radius: 8px;
  border: 4px solid #4a9eff;
  box-shadow: 0 0 20px rgba(74, 158, 255, 0.3);
  width: 100%;
  max-width: 400px;
  image-rendering: pixelated;
  backdrop-filter: blur(4px);
`;

const PixelInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin: 0.5rem 0;
  background: #000;
  border: 2px solid #ffffff;
  color: #ffffff;
  font-family: 'Press Start 2P', cursive;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #4a9eff;
  }
`;

const PixelButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  margin-top: 1rem;
  background: #4a9eff;
  border: none;
  color: white;
  font-family: 'Press Start 2P', cursive;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #357abd;
    transform: scale(1.02);
  }
`;

const Title = styled.h1`
  color: #4a9eff;
  text-align: center;
  font-family: 'Press Start 2P', cursive;
  margin-bottom: 2rem;
  text-shadow: 2px 2px #000000, 0 0 10px rgba(74, 158, 255, 0.5);
`;

const StyledLink = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 1rem;
  color: #4a9eff;
  font-family: 'Press Start 2P', cursive;
  font-size: 12px;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4a4a;
  font-family: 'Press Start 2P', cursive;
  font-size: 12px;
  margin-top: 1rem;
  text-align: center;
`;

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/auth/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      
      if (response.ok) {
        // Redirect to login page after successful signup
        navigate('/login');
      } else {
        const data = await response.json();
        setError(data.detail || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('An error occurred during signup.');
    }
  };

  return (
    <SignupContainer>
      <SignupBox>
        <Title>SIGN UP</Title>
        <form onSubmit={handleSubmit}>
          <PixelInput
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <PixelInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <PixelInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <PixelInput
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <PixelButton type="submit">
            CREATE ACCOUNT
          </PixelButton>
        </form>
        <StyledLink to="/login">Already have an account? Login</StyledLink>
      </SignupBox>
    </SignupContainer>
  );
};

export default Signup;