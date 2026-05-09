import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import signupImage from '../assets/LeftPaneImageForLogin.png'; // Replace with the actual path to your image
import { API_BASE_URL } from "../config/api";

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [city, setCity] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const auth = localStorage.getItem('user');
        if (auth) {
            navigate('/');
        }
    }, [navigate]);

    const collectData = async () => {
        if (!name || !email || !password || !phone || !gender || !city) {
            setError('All fields are required');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/users/register`, {
                method: 'POST',
                body: JSON.stringify({ name, email, password, phone, gender, city }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();

            if (response.ok && result.success) {
                localStorage.setItem("user", JSON.stringify(result.user));
                localStorage.setItem("token", result.accessToken || result.token);
                if (result.refreshToken) {
                    localStorage.setItem("refreshToken", result.refreshToken);
                }
                navigate('/');
            } else {
                setError(result.message || 'Sign up failed');
            }
        } catch (error) {
            console.error('Error during sign-up:', error);
            setError(`Could not connect to the backend at ${API_BASE_URL}. Please start the backend server.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='signup-container'>
            <div className='form-section'>
                <h1 className='header-text'>Register</h1>
                {error && <p className="error-message">{error}</p>}
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
                <button onClick={collectData} type='button' className='app-button' disabled={loading}>
                    {loading ? 'Signing Up...' : 'Sign Up'}
                </button>
            </div>
            <div className='image-section'>
                <img src={signupImage} alt="Sign Up" />
            </div>
        </div>
    );
};

export default SignUp;
