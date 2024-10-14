import React, { useEffect, useState } from 'react';
import './Styles/ID.css'; // Импортируйте CSS файл
import { useNavigate } from "react-router-dom";
import './Styles/All.css';

const All = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); // Добавляем состояние загрузки
    const navigate = useNavigate(); // Используем хук для навигации, если нужно

    useEffect(() => {
        jsonFromBack();
    }, []);

    const redirectTo = (url) => {
        navigate(url);
    };

    const jsonFromBack = async () => {
        setLoading(true); // Устанавливаем состояние загрузки перед началом запроса
        try {
            const response = await fetch(`https://localhost:8080/api/All`, {
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
        return <div className="loading">Loading...</div>; // Показываем индикатор загрузки
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="container1">
            <div className="table-container1">
                <table className="table1">
                    <thead className="thead1">
                    <tr className="tr1">
                        <th>Author</th>
                        <th>Name</th>
                        <th>Version</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.length > 0 ? (
                        data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.author}</td>
                                <td>{item.name}</td>
                                <td>{item.version}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No data available</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
            <div className="button-container1">
                <button className="back_up1" onClick={() => redirectTo('/')}>Назад</button>
            </div>
        </div>
    );
};

export default All;
