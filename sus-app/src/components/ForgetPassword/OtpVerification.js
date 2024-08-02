import React, { useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import backgroundImage from '../../assets/forget.jpg'; 

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: url(${backgroundImage}) no-repeat center center;
  background-size: cover;
  position: relative;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Black overlay with 50% opacity */
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.9); /* White background with 90% opacity */
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
`;

const InputBox = styled.input`
  width: 100%;
  max-width: 400px;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
  
  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const AppButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #0056b3;
  }
`;

const OtpVerification = () => {
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email; // Retrieve email from state

    const handleOtpVerification = async () => {
        let result = await fetch(`https://sustainability-connect-backend.onrender.com/api/auth/verify-otp`, {
            method: 'post',
            body: JSON.stringify({ email, otp }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        result = await result.json();
        if (result.success) {
            navigate('/change-password', { state: { email } });
        } else {
            alert(result.message);
        }
    };

    return (
        <Container>
            <Overlay />
            <Content>
                <PageTitle>OTP Verification</PageTitle>
                <InputBox 
                    type="text" 
                    placeholder="Enter OTP"
                    onChange={(e) => setOtp(e.target.value)} 
                    value={otp} 
                />
                <AppButton 
                    onClick={handleOtpVerification} 
                    type="button"
                >
                    Submit
                </AppButton>
            </Content>
        </Container>
    );
};

export default OtpVerification;



// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';

// const OtpVerification = () => {
//     const [otp, setOtp] = useState('');
//     const navigate = useNavigate();
//     const location = useLocation();
//     const email = location.state?.email; // Retrieve email from state

//     const handleOtpVerification = async () => {
//         let result = await fetch('http://localhost:4000/api/auth/verify-otp', {
//             method: 'post',
//             body: JSON.stringify({ email, otp }),
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         });
//         result = await result.json();
//         if (result.success) {
//             navigate('/change-password', { state: { email } });
//         } else {
//             alert(result.message);
//         }
//     }

//     return (
//         <div className="OtpVerification">
//             <h1 className="PageTitle">OTP Verification</h1>
//             <input className="inputBox" type="text" placeholder="Enter OTP"
//                 onChange={(e) => setOtp(e.target.value)} value={otp} />
//             <button onClick={handleOtpVerification} className="appButton" type="button">Submit</button>
//         </div>
//     );
// }

// export default OtpVerification;
