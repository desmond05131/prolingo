import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LoadingIndicator from "../LoadingIndicator";
import { login, getMyProfile } from "@/client-api";
import { refreshStats, refreshUserCourses, setUserRole } from "@/stores/stores";

export function LoginForm() {
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

            // Fetch current user to determine role-based redirect
            let dest = "/learn";
            try {
                const me = await getMyProfile();
                const role = String(me?.role || "student").toLowerCase();
                // Save role to global store for app-wide usage
                setUserRole(role);
                dest = role === "student" ? "/learn" : role === "lecturer" ? "/admin/course"  : "/admin";
            } catch {
                // If fetching profile fails, default to learn
                dest = "/learn";
            }

            // Proactively refresh global stats so the sidebar reflects the logged-in user
            // Fire-and-forget to avoid blocking navigation
            refreshStats().catch(() => { });
            refreshUserCourses().catch(() => { });

            navigate(dest);
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
