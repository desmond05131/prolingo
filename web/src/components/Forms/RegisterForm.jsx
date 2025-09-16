import { useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import "../../styles/Form.css";
import LoadingIndicator from "../LoadingIndicator";


export function RegisterForm({ route }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [profileIcon, setProfileIcon] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                username,
                email,
                password,
                profile_icon: profileIcon || null,
            };

            await api.post(route, payload);
            navigate("/login");
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>Register</h1>

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
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                autoComplete="email"
            />

            <input
                className="form-input"
                type="url"
                value={profileIcon}
                onChange={(e) => setProfileIcon(e.target.value)}
                placeholder="Profile Icon URL (optional)"
            />

            <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                autoComplete="new-password"
            />

            {loading && <LoadingIndicator />}

            <button className="form-button" type="submit" disabled={loading}>
                Register
            </button>
        </form>
    );
}

export default RegisterForm;