import React, { useState } from 'react';


export const ThemeMenu = React.createContext({
    createNewChat: false,

    setIsCreateChat: (bool) => {},    // Указываем, что функция принимает аргумент
});

const ContextForMenu = (props) => {
    // Состояния для разных переменных
    const [ createNewChat, setIdUpdated] = useState(false); // Задать начальное значение как строку

    // Функции для обновления состояний
    const  setIsCreateChat = (idUpdated) => setIdUpdated(idUpdated);

    // Объект, который содержит все данные и функции для их обновления
    const info = {
        createNewChat,
        setIsCreateChat
    };

    return (
        <ThemeMenu.Provider value={info}>
            {props.children}
        </ThemeMenu.Provider>
    );
};

export default ContextForMenu;
