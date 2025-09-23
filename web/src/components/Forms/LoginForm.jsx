import { useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import "../../styles/Form.css";
import LoadingIndicator from "../LoadingIndicator";

export function LoginForm({ route }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await api.post(route, { username, password });
            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
            navigate("/");
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>Login</h1>

            <input
                className="form-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                autoComplete="username"
            />

            <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                autoComplete="current-password"
            />

            {loading && <LoadingIndicator />}

            <button className="form-button" type="submit" disabled={loading}>
                Login
            </button>
        </form>
    );
}



export default LoginForm;
