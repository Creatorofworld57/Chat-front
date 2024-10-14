import React, { useEffect, useState } from 'react';
import './Styles/ID.css'; // Импортируйте CSS файл
import {useLocation, useNavigate} from "react-router-dom";

const Id = () => {
    const location = useLocation();
    const { inputValue } = location.state || { inputValue: 'No ID provided' };
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); // Добавляем состояние загрузки
    const navigate = useNavigate(); // Используем хук для навигации, если нужно
    const backendUrl = process.env.BACKEND_URL;
    useEffect(() => {
        jsonFromBack();
    }, []); // Добавляем зависимость от message, чтобы запрос выполнялся при его изменении
    const redirectTo = (url) => {
        navigate(url);
    };
    const jsonFromBack = async () => {
        setLoading(true); // Устанавливаем состояние загрузки перед началом запроса
        try {
            const response = await fetch(`${backendUrl}/api/programInfo/${inputValue}`, {
                method: 'GET',
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            setData(result);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false); // Сбрасываем состояние загрузки после завершения запроса
        }
    };

    if (loading) {
        return <div>Loading...</div>; // Показываем индикатор загрузки
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <table border="1" cellPadding="5" cellSpacing="0">
                <thead>
                <tr>
                    <th>Author</th>
                    <th>Version</th>
                    <th>Name</th>
                </tr>
                </thead>
                <tbody>
                {data && (
                    <>
                        <th>{data.author}</th>
                        <th>{data.name} </th>
                        <th>{data.version}</th>
                    </>
                )}
                </tbody>
            </table>
            <button className="back_up" onClick={() => redirectTo('/')}>Назад</button>
        </div>
    );
};

export default Id;
