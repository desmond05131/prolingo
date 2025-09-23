import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LoadingIndicator from "../LoadingIndicator";

const illustrationUrls = [
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=800&q=80",
];

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
            const res = await api.post(route, { username, password });
            localStorage.setItem(ACCESS_TOKEN, 'xxx' + res.data.access);
            localStorage.setItem(REFRESH_TOKEN, 'xxx' + res.data.refresh);
            navigate("/");
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
    <div className="flex min-h-screen flex-col lg:flex-row bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            {/* Left Column: Form */}
            <div className="flex w-full items-center justify-center px-6 py-10 sm:px-10 lg:w-1/2 lg:px-16">
                <div className="w-full max-w-md">
                    <div className="mb-10 space-y-2">
                        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Sign in</h1>
                        <p className="text-sm text-slate-500">Welcome back. Please enter your credentials to continue.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div className="sm:col-span-2 space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="johndoe"
                                    autoComplete="username"
                                    disabled={loading}
                                    required
                                />
                            </div>
                            <div className="sm:col-span-2 space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    disabled={loading}
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <Alert variant="destructive" className="text-sm">
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
            </div>

            {/* Right Column: Visual / Illustration */}
            <div className="relative flex w-full items-center justify-center overflow-hidden bg-slate-900 lg:w-1/2">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900/70 to-slate-900" aria-hidden="true" />
                <div className="relative z-10 grid w-full max-w-xl grid-cols-1 gap-6 p-10 sm:grid-cols-2">
                    {illustrationUrls.map((url, idx) => (
                        <div
                            key={url}
                            className={`group overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10 transition duration-500 hover:scale-[1.02] hover:ring-indigo-400/50 ${
                                idx === 0 ? "sm:col-span-2" : ""
                            }`}
                        >
                            <img
                                src={url}
                                alt="Language learning community"
                                className="h-52 w-full object-cover brightness-90 transition duration-500 group-hover:brightness-110 sm:h-60"
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default LoginForm;
