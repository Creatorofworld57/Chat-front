import React, { useContext, useState } from 'react';
import './Menu.css';
import { Theme } from "../../../HelperModuls/ThemeContext";
import CreateNewChat from "../../../NewChat/CreateNewChat";

import MainMenu from "./MainMenu";
import Settings from "./Settings";
import {ThemeMenu} from "../../../NewChat/ContextForMenu/ContextForMenu";
import Friends from "./Friends";

const Menu = ({ active }) => {


    const {createNewChat} = useContext(ThemeMenu);




    const renderActiveView = () => {
        switch (createNewChat) {
            case 0:
                return <MainMenu active={active}/>;
            case 1:
                return <CreateNewChat active={active}  />;
            case 2:
                return <Settings active={active}  />
            case 3:
                return <Friends active={active}/>
            default:
                return null;
        }
    };

    return (
        <div>
            {renderActiveView()}
        </div>

    );
};

export default Menu;
