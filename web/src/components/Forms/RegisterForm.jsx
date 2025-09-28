import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LoadingIndicator from "../LoadingIndicator";


export function RegisterForm({ route }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [profileIcon, setProfileIcon] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const payload = {
                username,
                email,
                password,
                profile_icon: profileIcon || null,
            };

            if (!username.trim() || !email.trim() || !password.trim()) {
                setError("Username, email, and password are required.");
                return;
            }

            await api.post(route, payload);
            navigate("/login");
        } catch (err) {
            const message =
                err?.response?.data?.detail ||
                err?.response?.data?.message ||
                (typeof err?.response?.data === "string" ? err.response.data : null) ||
                "Unable to register. Please check your inputs and try again.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md rounded-2xl bg-secondary border border-[#242c36] p-8 shadow-lg">
            <div className="mb-8 space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-100">Create account</h1>
                <p className="text-sm text-slate-400">Join Prolingo and start learning today.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-secondary" noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2 space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            className="rounded-md bg-white text-background px-3 py-2 text-sm"
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="username"
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="sm:col-span-2 space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            className="rounded-md bg-white text-background px-3 py-2 text-sm"
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="sm:col-span-2 space-y-2">
                        <Label htmlFor="profile_icon">Profile Icon URL (optional)</Label>
                        <Input
                            className="rounded-md bg-white text-background px-3 py-2 text-sm"
                            id="profile_icon"
                            type="url"
                            value={profileIcon}
                            onChange={(e) => setProfileIcon(e.target.value)}
                            placeholder="https://example.com/avatar.png"
                            disabled={loading}
                        />
                    </div>

                    <div className="sm:col-span-2 space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            className="rounded-md bg-white text-background px-3 py-2 text-sm"
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                            disabled={loading}
                            required
                        />
                    </div>
                </div>

                {error && (
                    <Alert variant="destructive" className="text-sm bg-destructive text-white">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="pt-2">
                    <Button type="submit" disabled={loading} className="w-full" size="lg">
                        <span className="flex w-full items-center justify-center gap-3">
                            <span>{loading ? "Creating account" : "Create account"}</span>
                            {loading && <LoadingIndicator />}
                        </span>
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default RegisterForm;