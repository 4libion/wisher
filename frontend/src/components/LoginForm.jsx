import { useState } from "react";
import { useNavigate } from 'react-router-dom';

import { useUser } from "../auth/UserContext";
import { loginUser } from '../auth/AuthService';

import api from '../auth/axiosConfig';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { fetchUser } = useUser();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login/', { email, password });
            loginUser({
                access: res.data.access,
                refresh: res.data.refresh,
            });
            await fetchUser();
            navigate('/');
        } catch (err) {
            console.error("Full error:", err);
            if (err.response) {
                console.error("Backend response:", err.response.data);
            }
            setError(err.response?.data?.detail || 'Login failed');
        }
    };

    return (
        <form onSubmit={handleLogin} style={{ marginBottom: '2rem' }}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <label>Email:</label><br />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
                <label>Password:</label><br />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" style={{ marginTop: '1rem' }}>Login</button>
        </form>
    )
}