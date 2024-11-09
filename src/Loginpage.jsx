import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/Loginpage.css';
import { FaGithub } from 'react-icons/fa';

const LoginPage = () => {
    const navigate = useNavigate();
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const loginUrl = `${backendUrl}/login`;

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const redirectTo = (url) => {
        navigate(url);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(loginUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, password }),
            });

            if (response.ok) {
                const data = await response.json();
                const token = data.token;  // Предположим, что сервер возвращает объект с полем token
                localStorage.setItem('jwtToken', token);  // Сохраняем токен в localStorage
                // Handle successful login, e.g., save token, redirect
                console.log('Login successful', data);
                redirectTo('/home'); // Redirect after successful login
            } else {
                // Handle errors, e.g., wrong credentials
                setErrorMessage('Invalid username or password');
            }
        } catch (error) {
            setErrorMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div className="container">
            <button className="top-left-button" onClick={() => redirectTo('/')}>
                Назад
            </button>

            <form onSubmit={handleSubmit}>
                <div className="naming">
                    <img
                        src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                        alt="GitHub Logo"
                        className="logo"
                    />
                    <h1>Sign in to Base</h1>

                    <input
                        className="inputLog"
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <input
                        className="inputLog"
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <div className="imgEntry">
                        <a
                            href="https://localhost:8080/oauth2/authorization/github"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Continue with <FaGithub />
                        </a>
                    </div>

                    {errorMessage && <p className="error-message">{errorMessage}</p>}

                    <button className="button" type="submit">
                        Login
                    </button>
                </div>
            </form>

            <a className="reg_ref" onClick={() => redirectTo('/reg')}>
                I haven't account
            </a>
        </div>
    );
};

export default LoginPage;
