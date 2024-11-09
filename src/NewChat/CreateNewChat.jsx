import React, {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Theme} from "../HelperModuls/ThemeContext";
import "./CreateNewChat.css"


const CreateNewChat = (isNewChat1,setIsNewChat)=>{



    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const navigate = useNavigate();
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const token = localStorage.getItem('jwtToken');
    const { color, setColorTheme } = useContext(Theme);
    const getUsersList = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/getUsers`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const userList = await response.json();
                setUsers(userList);
            }
        } catch (error) {
            console.error('Error fetching users list:', error);
            alert('Error fetching users.');
        }
    };
    const handleUserSelection = (id) => {
        setSelectedUsers((prevSelected) => [...prevSelected, id]);
    };
    const createChat = async ()=>{
        try {
            const response = await fetch(`${backendUrl}/apiChats/createChat`, {
                method: 'POST',
                body:JSON.stringify(selectedUsers),
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {

            }
        } catch (error) {
            console.error('Error fetching users list:', error);
            alert('Error fetching users.');
        }
    }

    useEffect(() => {
            getUsersList();

    }, []);

    return (
        <div className={color ? "menu-items-newChat" : "menu-items light"}>
            <ul>
                {users && users.length > 0 ? (
                    users.slice().reverse().map((user, index) => (
                        <li key={index} className="item">
                            <img
                                className="track-image-newChat"
                                onClick={() => handleUserSelection(user.id)}
                                src={`${backendUrl}/api/images/${user.id}`}
                                alt="Track"
                            />
                            <div className="newChat-container">
                                <div className={color ? "name-newChat" : "name-playlist light"}>{user.name}</div>
                            </div>
                        </li>
                    ))


                ) : (
                    <li>No users available</li>
                )}
                <li onClick={()=>createChat()}>Создать чат</li>
            </ul>
        </div>

    )
}
export default CreateNewChat