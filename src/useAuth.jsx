import { useState, useEffect } from 'react';

const useAuth = () => {
    const [auth, setAuth] = useState(false);
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    useEffect(() => {
        const fetchAuth = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/authorization`, {
                    method: 'GET',
                    credentials: 'include'
                });

                if (response.status===200) {
                    setAuth(true);
                } else {
                    setAuth(false);
                }
            } catch (error) {
                setAuth(false);
            }
        };

        fetchAuth();
    }, []);

    return { auth };
};

export default useAuth;
