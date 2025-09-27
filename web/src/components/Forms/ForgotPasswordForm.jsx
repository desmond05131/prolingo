import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LoadingIndicator from "../LoadingIndicator";

function SuccessMessage({ email }) {
  return (
    <Alert className="text-sm bg-emerald-600/20 border-emerald-700 text-emerald-200">
      <AlertDescription>
        If an account exists for {email}, you'll receive a password reset email shortly.
      </AlertDescription>
    </Alert>
  );
}

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSent(false);

    try {
      // Try a conventional endpoint name; backend may vary.
      // We intentionally do not reveal whether the email exists.
      await api.post("/auth/forgot-password/", { email });
      setSent(true);
    } catch (err) {
      // Even if the backend returns 404 or 400, still show success to avoid user enumeration
      const status = err?.response?.status;
      if (status === 404 || status === 400 || status === 401) {
        setSent(true);
      } else {
        setError(
          err?.response?.data?.detail ||
            err?.response?.data?.message ||
            "We couldn't process your request right now. Please try again later."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-secondary border border-[#242c36] p-8 shadow-lg">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-100">Forgot password</h1>
        <p className="text-sm text-slate-400">Enter your email and we'll send you a reset link.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-secondary" noValidate>
        <div className="space-y-2">
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

        {error && (
          <Alert variant="destructive" className="text-sm bg-destructive text-white">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {sent && <SuccessMessage email={email} />}

        <div className="pt-2">
          <Button type="submit" disabled={loading} className="w-full" size="lg">
            <span className="flex w-full items-center justify-center gap-3">
              <span>{loading ? "Sending" : "Send reset link"}</span>
              {loading && <LoadingIndicator />}
            </span>
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center text-sm text-slate-400">
        <div>
          Remembered your password? {" "}
          <Link to="/login" className="text-blue-400 hover:underline">Sign in</Link>
        </div>
        <div className="mt-2">
          Don't have an account? {" "}
          <Link to="/register" className="text-blue-400 hover:underline">Create one</Link>
        </div>
      </div>
    </div>
  );
}
