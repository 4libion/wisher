import { createContext, useContext, useEffect, useState } from "react";
import { getAccessToken, logoutUser } from "./AuthService";
import api from "./axiosConfig";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (!getAccessToken()) {
                setLoading(false);
                return;
            }

            try {
                const res = await api.get('/user/me/');
                setUser(res.data);
            } catch (err) {
                console.error("Failed to fetch user:", err);
                logoutUser();
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const logout = () => {
        logoutUser();
        setUser(null);
        window.location.href = "/login";
    };

    return (
        <UserContext.Provider value={{ user, setUser, logout, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);