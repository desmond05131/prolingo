import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LoadingIndicator from "../LoadingIndicator";
import { login } from "@/client-api";

export function LoginForm({ route }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await login({ username, password });
            localStorage.setItem(ACCESS_TOKEN, res.access);
            localStorage.setItem(REFRESH_TOKEN, res.refresh);
            navigate("/learn");
        } catch (err) {
            const message =
                err?.response?.data?.detail ||
                err?.response?.data?.message ||
                "Unable to sign in. Please check your credentials.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md rounded-2xl bg-secondary border border-[#242c36] p-8 shadow-lg">
            <div className="mb-8 space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-100">Sign in</h1>
                <p className="text-sm text-slate-400">Welcome back. Please enter your credentials to continue.</p>
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
                        <Label htmlFor="password">Password</Label>
                        <Input
                            className="rounded-md bg-white text-background px-3 py-2 text-sm"
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
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
                    <Button variant={""} type="submit" disabled={loading} className="w-full" size="lg">
                        <span className="flex w-full items-center justify-center gap-3">
                            <span>{loading ? "Signing in" : "Sign in"}</span>
                            {loading && <LoadingIndicator />}
                        </span>
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default LoginForm;
