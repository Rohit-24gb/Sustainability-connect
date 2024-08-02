import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import backgroundImage from '../../assets/forget.jpg'; // Update this path

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
  background:rgba(85, 205, 85, 0.8);
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

const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleForgetPassword = async () => {
        let result = await fetch(`https://sustainability-connect-backend.onrender.com/api/auth/forget-password`, {
            method: 'post',
            body: JSON.stringify({ email }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        result = await result.json();
        if (result.success) {
            toast.success('OTP has been sent to your email!', { autoClose: 500 });
            navigate('/otp-verification', { state: { email } });
        } else {
            toast.error(result.message);
        }
    };

    return (
        <Container>
            <Overlay />
            <Content>
                <PageTitle>Forget Password</PageTitle>
                <InputBox 
                    type="email" 
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)} 
                    value={email} 
                />
                <AppButton 
                    onClick={handleForgetPassword} 
                    type="button"
                >
                    Submit
                </AppButton>
            </Content>
        </Container>
    );
};

export default ForgetPassword;



// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';

// const ForgetPassword = () => {
//     const [email, setEmail] = useState('');
//     const navigate = useNavigate();

//     const handleForgetPassword = async () => {
//         let result = await fetch('http://localhost:4000/api/auth/forget-password', {
//             method: 'post',
//             body: JSON.stringify({ email }),
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         });
//         result = await result.json();
//         if (result.success) {
//             toast.success('OTP has been sent to your email!', { autoClose: 500 });
//             navigate('/otp-verification', { state: { email } });
//         } else {
//             toast.error(result.message);
//         }
//     }

//     return (
//         <div className="ForgetPassword">
//             <h1 className="PageTitle">Forget Password</h1>
//             <input 
//                 className="inputBox" 
//                 type="email" 
//                 placeholder="Enter your email"
//                 onChange={(e) => setEmail(e.target.value)} 
//                 value={email} 
//             />
//             <button 
//                 onClick={handleForgetPassword} 
//                 className="appButton" 
//                 type="button"
//             >
//                 Submit
//             </button>
//         </div>
//     );
// }

// export default ForgetPassword;
