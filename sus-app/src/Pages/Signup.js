import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import signupImage from '../assets/LeftPaneImageForLogin.png'; // Replace with the actual path to your image

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [city, setCity] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const auth = localStorage.getItem('user');
        if (auth) {
            navigate('/');
        }
    }, [navigate]);

    const collectData = async () => {
        try {
            let result = await fetch('https://sustainability-connect-backend.onrender.com/api/users/register', {
                method: 'POST',
                body: JSON.stringify({ name, email, password, phone, gender, city }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            result = await result.json();
            if (result) {
                navigate('/');
                localStorage.setItem("user", JSON.stringify(result));
            }
        } catch (error) {
            console.error('Error during sign-up:', error);
        }
    };

    return (
        <div className='signup-container'>
            <div className='form-section'>
                <h1 className='header-text'>Register</h1>
                <input
                    className='input-box'
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='Enter Name'
                />
                <input
                    className='input-box'
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Enter Email'
                />
                <input
                    className='input-box'
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Enter Password'
                />
                <input
                    className='input-box'
                    type='text'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder='Enter Phone'
                />
                <input
                    className='input-box'
                    type='text'
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    placeholder='Enter Gender'
                />
                <input
                    className='input-box'
                    type='text'
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder='Enter City'
                />
                <button onClick={collectData} type='button' className='app-button'>
                    Sign Up
                </button>
            </div>
            <div className='image-section'>
                <img src={signupImage} alt="Sign Up" />
            </div>
        </div>
    );
};

export default SignUp;


