import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { register } from '../api/authentication';

export default function RegisterForm() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            let data = {
                email: email,
                password: password,
            };
            const response = await register(data);
            setSuccess('Successfull registration! You can now log in.');
            navigate('/login/');
        } catch (err) {
            console.error('Error response:', err.response?.data);
            setError(err.response?.data?.email?.[0] || err.response?.data?.password?.[0] || err.response?.data?.detail || 'Registration failed');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Register</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <div>
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
            </div>
            <button type='submit'>Register</button>
        </form>
    );
};