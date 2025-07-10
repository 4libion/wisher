import { useState } from "react";
import GoogleLoginButton from "../auth/GoogleLoginButton";

export default function LoginPage() {
    const [user, setUser] = useState(null);

    return (
        <div>
            <h2>Login</h2>
            <GoogleLoginButton setUser={setUser} />
        </div>
    );
}