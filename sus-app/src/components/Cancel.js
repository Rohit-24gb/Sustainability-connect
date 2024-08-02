import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import cancelVideo from '../assets/cancel_animation.mp4'; // Update this path

const cancelAnimation = keyframes`
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

const CancelContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
`;

const CancelVideo = styled.video`
  width: 450px; /* Adjust size as needed */
  animation: ${cancelAnimation} 2s ease-out forwards;
  opacity: 0;
  transform: scale(0.5);
`;

const Cancel = () => {
  return (
    <CancelContainer>
      <Link to="/">
        <CancelVideo src={cancelVideo} autoPlay loop muted />
      </Link>
    </CancelContainer>
  );
}

export default Cancel;
