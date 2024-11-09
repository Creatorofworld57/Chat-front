import React, { useContext, useEffect, useState } from 'react';
import '../Styles/Menu.css';
import { useNavigate } from "react-router-dom";
import { Theme } from "./ThemeContext";
import CreateNewChat from "../NewChat/CreateNewChat";

const Menu = ({ active, setActive }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isRotated, setIsRotated] = useState(false);
    const [user, setUser] = useState(null);
    const [userImage, setUserImage] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [isNewChat, setIsNewChat] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const navigate = useNavigate();
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const token = localStorage.getItem('jwtToken');
    const { color, setColorTheme } = useContext(Theme);

    const toggleToolbar = () => {
        setIsOpen(!isOpen);
        setIsRotated(!isRotated);
    };

    const redirectTo = (url) => navigate(url);

    const redirectToLogout = () => {
        token.setItem('jwtToken',null)
        window.location.href('/');
    };

    const getUserInfo = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/userInfo`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const userImg = await response.text();
            setUserImage(userImg);
        } catch (error) {
            console.error('Error fetching user image:', error);
        }
    };

    const getUser = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/infoAboutUser`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const userData = await response.json();
            setUser(userData);
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    const deleteUserAccount = async () => {
        try {
            if (window.confirm('Are you sure you want to delete your account?')) {
                const response = await fetch(`${backendUrl}/api/user`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) window.location.replace(`${backendUrl}/logout`);
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('Error deleting account.');
        }
    };

    const handleThemeChange = (event) => {
        const checked = event.target.checked;
        setIsChecked(checked);
        setColorTheme(!color);
        document.body.style.backgroundColor = color ? "lightgrey" : "black";
        document.body.style.color = color ? "black" : "white";
    };







    useEffect(() => {
        getUserInfo();
        getUser();
    }, []);

    return (
        <div className={active ? 'menu active' : 'menu'}>
            <div className={active ? 'blur active' : 'blur'} />
            {!isNewChat ? (
                <div className="menu-content">
                    <ul>
                        {user && (
                            <>
                                <li>
                                    <img id="myImage" src={`${backendUrl}/api/images/${userImage}`} alt="Profile" />
                                </li>
                                <li>Имя: {user.name}</li>
                                <li>Created: {new Date(user.createdAt).toLocaleDateString()}</li>
                                <li>Updated: {new Date(user.updatedAt).toLocaleDateString()}</li>
                            </>
                        )}
                        <li><a onClick={() => setIsNewChat(true)}>Создать новый чат</a></li>
                        <li className="exit"><a onClick={deleteUserAccount}>Удалить аккаунт</a></li>
                        <li><a onClick={() => redirectTo('/update')}>Обновить данные</a></li>
                        <li className='exit'><a className="exit" onClick={redirectToLogout}>Выйти</a></li>
                        <li>
                            <div className="toggle-switch">
                                <input
                                    type="checkbox"
                                    id="toggle"
                                    className="toggle-input"
                                    checked={isChecked}
                                    onChange={handleThemeChange}
                                />
                                <label htmlFor="toggle" className="toggle-label"></label>
                            </div>
                        </li>
                    </ul>
                </div>
            ) : (
              <CreateNewChat/>
            )}
        </div>
    );
};

export default Menu;
