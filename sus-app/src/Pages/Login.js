import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import loginImage from '../assets/LeftPaneImageForLogin.png'; // Replace with the actual path to your image

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Both email and password are required');
            return;
        }

        const gmailRegex = /^[^\s@]+@gmail\.com$/;
        if (!gmailRegex.test(email)) {
        setError('Invalid Gmail address');
        return;
        }


        setError('');

        try {
            let response = await fetch('https://sustainability-connect-backend.onrender.com/api/users/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            let result = await response.json();

            if (result.success) {
                localStorage.setItem("user", JSON.stringify(result.user));
                navigate('/');
            } else {
                setError('Invalid email or password');
            }
        } catch (error) {
            console.error('Login failed:', error);
            setError('Login failed, please try again later');
        }
    }

    return (
        <div className="login-container">
            <div className="image-section">
                <img src={loginImage} alt="Login Illustration" />
            </div>
            <div className="form-section">
                <h1 className="page-title">Login Page</h1>
                {error && <p className="error-message">{error}</p>}
                <input
                    className="input-box"
                    type="text"
                    placeholder="Enter email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
                <input
                    className="input-box"
                    type="password"
                    placeholder="Enter Password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
                <button onClick={handleLogin} className="app-button" type="button">Login</button>
                <p><a href="/forget-password">Forget Password?</a></p>
            </div>
        </div>
    );
}

export default Login;





// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';


// const Login = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const navigate = useNavigate();

//     const handleLogin = async () => {
//         if (!email || !password) {
//             setError('Both email and password are required');
//             return;
//         }

//         // Basic email validation
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(email)) {
//             setError('Invalid email format');
//             return;
//         }

//         setError(''); // Clear previous errors

//         try {
//             let response = await fetch('http://localhost:4000/api/users/login', {
//                 method: 'POST',
//                 body: JSON.stringify({ email, password }),
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             });

//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }

//             let result = await response.json();

//             if (result.success) {
//                 localStorage.setItem("user", JSON.stringify(result.user));
//                 navigate('/');
//             } else {
//                 setError('Invalid email or password');
//             }
//         } catch (error) {
//             console.error('Login failed:', error);
//             setError('Login failed, please try again later');
//         }
//     }

//     return (
//         <div className="Login">
//             <h1 className="PageTitle">Login Page</h1>
//             {error && <p className="error-message">{error}</p>}
//             <input
//                 className="inputBox"
//                 type="text"
//                 placeholder="Enter email"
//                 onChange={(e) => setEmail(e.target.value)}
//                 value={email}
//             />
//             <input
//                 className="inputBox"
//                 type="password"
//                 placeholder="Enter Password"
//                 onChange={(e) => setPassword(e.target.value)}
//                 value={password}
//             />
//             <button onClick={handleLogin} className="appButton" type="button">Login</button>
//             <p><a href="/forget-password">Forget Password?</a></p>
//         </div>
//     );
// }

// export default Login;





