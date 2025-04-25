import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
              url('/images/underwater-fantasy-preview.png') no-repeat center center fixed;
  background-size: cover;
  image-rendering: pixelated;
`;

const LoginBox = styled.div`
  background: rgba(0, 0, 0, 0.8);
  padding: 2rem;
  border-radius: 8px;
  border: 4px solid #ffffff;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  width: 100%;
  max-width: 400px;
  image-rendering: pixelated;
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
  color: #ffffff;
  text-align: center;
  font-family: 'Press Start 2P', cursive;
  margin-bottom: 2rem;
  text-shadow: 2px 2px #000000;
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

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      if (response.ok) {
        const data = await response.json();
        // Store the token in localStorage
        localStorage.setItem('token', data.access_token);
        // Redirect to main app
        navigate('/chat')
      } else {
        const errorData = await response.json();
        alert(errorData.detail || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login.');
    }
  };

  return (
    <LoginContainer>
      <LoginBox>
        <Title>KATABASIS</Title>
        <form onSubmit={handleSubmit}>
          <PixelInput
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <PixelInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <PixelButton type="submit">
            LOGIN
          </PixelButton>
        </form>
        <StyledLink to="/signup">
            Don't have an account? Sign up
        </StyledLink>
      </LoginBox>
    </LoginContainer>
  );
};

export default Login;