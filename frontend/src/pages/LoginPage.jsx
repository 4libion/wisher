import { useState } from "react";
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
        </div>
    );
}