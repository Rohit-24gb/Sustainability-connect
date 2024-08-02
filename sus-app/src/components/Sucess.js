import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import successVideo from '../assets/success_animation.mp4'; // Update this path

const successAnimation = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const SuccessContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
`;

const SuccessVideo = styled.video`
  width: 450px; /* Adjust size as needed */
  animation: ${successAnimation} 2s ease-out forwards;
  opacity: 0;
  transform: scale(0.5);
`;

const Success = () => {
  return (
    <SuccessContainer>
      <Link to="/">
        <SuccessVideo src={successVideo} autoPlay loop muted />
      </Link>
    </SuccessContainer>
  );
}

export default Success;
