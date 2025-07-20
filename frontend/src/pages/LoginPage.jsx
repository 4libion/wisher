import { useState } from "react";
import { Link } from 'react-router-dom';
import GoogleLoginButton from "../auth/GoogleLoginButton";
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
    const [user, setUser] = useState(null);

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Login</h2>
            <LoginForm />
            <hr />
            <GoogleLoginButton setUser={setUser} />
            <br />
            <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
    );
}