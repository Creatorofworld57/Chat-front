import React, { useState } from 'react';
import '../MainComponents/Profile/Menu/Menu.css';

export const Theme = React.createContext({
    color: false,
    setColorTheme: (color) => {},  // Указываем, что функция принимает аргумент

});

const ThemeContext = (props) => {
    // Состояния для разных переменных
    const [color, setColor] = useState(true); // Цвет темы


    // Функции для обновления состояний
    const setColorTheme = (color) => setColor(color);


    // Объект, который содержит все данные и функции для их обновления
    const info = {
        color,
        setColorTheme,
    };

    return (
        <Theme.Provider value={info}>
            {props.children}
        </Theme.Provider>
    );
};

export default ThemeContext;
