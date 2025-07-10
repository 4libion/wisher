import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import api from "./axiosConfig";
import { loginUser } from "./AuthService";
import { useUser } from "./UserContext";


const GoogleLoginButton = () => {
    const navigate = useNavigate();
    const { setUser } = useUser();

    const login = useGoogleLogin({
        onSuccess: async ({ access_token }) => {
            try {
                const response = await api.post('/auth/accounts/google/', { token: access_token });
                loginUser(response.data);
                const userRes = await api.get('/user/me/');
                setUser(userRes.data);
                navigate("/");
            } catch (err) {
                console.error("Google login failed:", err.response?.data || err.message);
            }   
        },
        onError: () => console.error("Google login failed"),
        scope: "openid email profile",
        flow: "implicit",
    });

    return (
        <button onClick={login} style={{ padding: '10px 20px' }}>
            Sign in with Google
        </button>
    );
};

export default GoogleLoginButton;