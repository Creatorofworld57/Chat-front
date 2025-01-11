import { configureStore } from '@reduxjs/toolkit';

import counterReducer from "./Reducers/counterReducer";
import menuReducer from "./Reducers/menuReducer"; // Импорт редьюсера

const store = configureStore({
    reducer: {
        example: counterReducer,
        menu_red: menuReducer// Добавьте ваш редьюсер сюда
    },
});

export default store;
