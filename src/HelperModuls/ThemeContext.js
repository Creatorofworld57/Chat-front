import React, { useState } from 'react';
import '../MainComponents/Profile/Menu/Menu.css';

export const Theme = React.createContext({
    color: false,
    updated: false,
    chatId: 0,
    id: 0,// Установить значение по умолчанию, соответствующее типу string
    setColorTheme: (color) => {},  // Указываем, что функция принимает аргумент
    setUpdateValue: (updated) => {},    // Указываем, что функция принимает аргумент
    setChatIdValue: (chatId) => {},    // Указываем, что функция принимает аргумент
    setIdUpdatedValue: (id) => {},    // Указываем, что функция принимает аргумент
});

const ThemeContext = (props) => {
    // Состояния для разных переменных
    const [color, setColor] = useState(true); // Цвет темы
    const [updated, setUpdated] = useState(false); // ID
    const [chatId, setChatId] = useState(0); // Задать начальное значение как строку
    const [idUpdated, setIdUpdated] = useState(0); // Задать начальное значение как строку

    // Функции для обновления состояний
    const setColorTheme = (color) => setColor(color);
    const setUpdateValue = (updated) => setUpdated(updated);
    const setChatIdValue = (chatId) => setChatId(chatId);
    const setIdUpdatedValue = (idUpdated) => setIdUpdated(idUpdated);

    // Объект, который содержит все данные и функции для их обновления
    const info = {
        color,
        setColorTheme,
        updated,
        setUpdateValue,
        chatId,
        setChatIdValue,
        idUpdated,
        setIdUpdatedValue
    };

    return (
        <Theme.Provider value={info}>
            {props.children}
        </Theme.Provider>
    );
};

export default ThemeContext;
