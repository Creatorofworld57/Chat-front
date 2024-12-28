import React, {useContext} from "react";
import {Theme} from "../../../HelperModuls/ThemeContext";


const Friends = ({active})=>{

    const { color, setColorTheme } = useContext(Theme);


    return (
        <div className={active ? !color ? "menu active light" : "menu active" : !color ? "menu light" : "menu"}>


            <ul>

                <li className={color ?"liMenu":"liMenu light"}><a
                    >Друзей пока нет</a></li>
            </ul>
        </div>


    )
}
export default Friends;