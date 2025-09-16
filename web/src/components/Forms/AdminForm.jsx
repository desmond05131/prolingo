import { useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import "../../styles/AdminForm.css";
import LoadingIndicator from "../LoadingIndicator";

function Form({ route }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("student");
    const [profileIcon, setProfileIcon] = useState("");
    const [isPremium, setIsPremium] = useState(false);
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
                role,
                profile_icon: profileIcon || null,
                is_premium: isPremium,
            };

            await api.post(route, payload);
            // navigate("/login");
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>Create Account</h1>

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

            <select
                className="form-input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
            >
                <option value="student">Student</option>
                <option value="lecturer">Lecturer</option>
                <option value="admin">Admin</option>
            </select>

            <input
                className="form-input"
                type="url"
                value={profileIcon}
                onChange={(e) => setProfileIcon(e.target.value)}
                placeholder="Profile Icon URL (optional)"
            />

            <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                    type="checkbox"
                    checked={isPremium}
                    onChange={(e) => setIsPremium(e.target.checked)}
                />
                Premium account
            </label>

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
                Create Account
            </button>
        </form>
    );
}

export default Form;
