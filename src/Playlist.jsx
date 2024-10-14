import React, {useState, useEffect, useContext} from 'react';

import {MyContext} from "./HelperModuls/ContextForAudio";
import {useNavigate} from "react-router-dom";
import './Styles/Playlist.css'

const Playlist = ({name}) => {
    const [tracks, setTracks] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const[isActive,setIsActive] = useState(true)
    const navigate = useNavigate();
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const redirectTo = (url) => {
        navigate(url);
    };
    const responseForTracks = async () => {
        setIsLoading(true)
        const response = await fetch(`${backendUrl}/api/likedPlaylist/names`, {
            method: 'GET',
            credentials: 'include'
        })
        const data = await response.json()
        setTracks(data);
        setIsLoading(false)
    }
    const {data, setDat} = useContext(MyContext); // Деструктурируем setDat

    const handleClick = (id) => {
        setDat(id); // Правильно вызываем setDat
    };
    useEffect(() => {
        responseForTracks();
    }, []);

    return (
        <div className="menu1.open">
            <ul>
                {isLoading ? (
                    // Показываем скелетоны во время загрузки данных
                    Array.from({length: 5}).map((_, index) => (
                        <li key={index} className="skeleton-track-item">
                            <div className="skeleton-image1"></div>
                            <div className="skeleton-text1"></div>
                        </li>
                    ))
                ) : tracks && tracks.length > 0 ? (
                    // Показываем треки в обратном порядке
                    tracks.slice().reverse().map((audio, index) => (
                        <li key={index} className="track-item12" onClick={() => handleClick(audio.id)}>
                            <img className="track-image12"
                                 src={`${backendUrl}/api/likedPlaylist/images/${audio.id}`}/>
                            {audio.name}
                            <div className={`scatering ${isActive ? 'active' : ''}`}>
                            </div>
                        </li>
                    ))
                ) : (
                    <li>Треки не найдены</li>
                )}
            </ul>
            <button className="back_up" onClick={() => redirectTo('/profile')}></button>
        </div>

    );
};
export default Playlist;
