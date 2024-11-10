import React, { useRef, useEffect } from 'react';

const ImageMerger = ({ chatIds }) => {
    const canvasRef = useRef(null);
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        if (!chatIds || chatIds.length === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (chatIds.length === 2) {
            chatIds = chatIds.slice(1); // Возьмем первые 2 элемента, если длина равна 2
        } else if (chatIds.length > 4) {
            chatIds = chatIds.slice(0, 3); // Возьмем первые 3 элемента, если длина больше 4
        }
        // Создание массива URL-ов изображений
        const images = chatIds.map(id => `${backendUrl}/api/images/${id}`);


        // Функция загрузки и отрисовки изображений
        const loadImages = async () => {
            try {
                const loadedImages = await Promise.all(
                    images.map(src => {
                        return new Promise((resolve, reject) => {
                            const img = new Image();
                            img.src = src;
                            img.onload = () => resolve(img);
                            img.onerror = reject;
                        });
                    })
                );

                // Очистка холста
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Установка размеров холста 50x50
                canvas.width = 50;
                canvas.height = 50;

                // Настройка отрисовки изображений (можно настраивать, как вам удобно)
                const imageSize = 25; // Размер каждого изображения
                loadedImages.forEach((img, index) => {
                    // Отрисовка изображений в пределах 50x50, разделение на два ряда
                    const x = (index % 2) * imageSize;
                    const y = Math.floor(index / 2) * imageSize;
                    ctx.drawImage(img, x, y, imageSize, imageSize);
                });
            } catch (error) {
                console.error('Ошибка загрузки изображений:', error);
            }
        };

        loadImages();
    }, [chatIds, backendUrl]);

    return <canvas ref={canvasRef} style={{ width: '50px', height: '50px' }}></canvas>;
};

export default ImageMerger;
