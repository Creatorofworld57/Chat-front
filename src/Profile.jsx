import React, { useEffect, useState } from 'react';
import './Styles/Profile.css';
import { useNavigate } from 'react-router-dom';
import Menu from './HelperModuls/Menu';
import { FaGithub, FaTelegramPlane } from 'react-icons/fa';
import Chats from "./Chats";
import Messenger from "./Messenger";

const Profile = () => {
    const navigate = useNavigate();
    const [menuActive, setMenuActive] = useState(false);
    const [url1, setUrl1] = useState('');
    const [url2, setUrl2] = useState('');
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const token = localStorage.getItem('jwtToken');


    const redirectTo = (url) => {
        navigate(url);
    };

    const userSocials = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/socials`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,  // Добавляем токен в заголовок
                    'Content-Type': 'application/json',
                },
            });
            const user = await response.json();

        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        userSocials();
    }, []);

    return (
        <div>
            <nav>
                <div className='burger-btn' onClick={() => setMenuActive(!menuActive)}>
                    <span className={menuActive ? 'line1 active' : 'line1'}/>
                    <span className={menuActive ? 'line2 active' : 'line2'}/>
                    <span className={menuActive ? 'line3 active' : 'line3'}/>
                </div>
            </nav>


            <button className="back_up" onClick={() => redirectTo('/home')}></button>

            <Menu active={menuActive} setActive={setMenuActive}/>
            <div className="chats-container">
                <Chats/>
            </div>
            <div className="messanger-container">
            <Messenger/>
                </div>
            {url1 && (
                <div className="link-preview">
                    <a href={url1} target="_blank" rel="noopener noreferrer">
                        <FaTelegramPlane/> {url1}
                    </a>
                </div>
            )}
            {url2 && (
                <div className="link-preview1">
                    <a href={url2} target="_blank" rel="noopener noreferrer">
                        <FaGithub/> {url2}
                    </a>
                </div>
            )}
        </div>
    );
};

export default Profile;
