import { useEffect, useState } from "react";
import api from "./axiosConfig";
import { logoutUser } from "./AuthService";

const useAuth = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = api.get('/user/me/');
                setUser(res.data);
            } catch (err) {
                logoutUser();
            }
        };
        fetchUser();
    }, []);

    return {
        user,
        logout: () => {
            logoutUser();
            window.location.href = "/login";
        },
    };
};

export default useAuth;