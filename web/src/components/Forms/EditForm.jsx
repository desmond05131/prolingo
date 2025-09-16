import { useState, useEffect } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import "../../styles/Form.css";
import LoadingIndicator from "../LoadingIndicator";

/**
 * EditForm
 * - GETs the current user's account at `route` and fills current username + email (read-only)
 * - Allows changing username (PATCH to `route`) and changing password with fallback support
 * - route accepts with/without leading/trailing slash
 */
export default function EditForm({
  route = "/api/users/account/manage/",
  changePasswordRoute = "/auth/change-password/",
}) {
  const navigate = useNavigate();

  const normalizeRoute = (r) => {
    if (!r) return r;
    return r.startsWith("/") ? (r.endsWith("/") ? r : r + "/") : "/" + (r.endsWith("/") ? r : r + "/");
  };

  const apiRoute = normalizeRoute(route);
  const pwdRoute = normalizeRoute(changePasswordRoute);

  const getInitialUsername = () => {
    try {
      const userRaw = localStorage.getItem("user");
      if (userRaw) {
        const u = JSON.parse(userRaw);
        if (u && typeof u.username === "string") return u.username;
      }
      const username = localStorage.getItem("username");
      return username || "";
    } catch {
      return "";
    }
  };

  const getInitialEmail = () => {
    try {
      const userRaw = localStorage.getItem("user");
      if (userRaw) {
        const u = JSON.parse(userRaw);
        if (u && typeof u.email === "string") return u.email;
      }
      const email = localStorage.getItem("email");
      return email || "";
    } catch {
      return "";
    }
  };

  const [currentUsername, setCurrentUsername] = useState(getInitialUsername());
  const [email, setEmail] = useState(getInitialEmail());
  const [newUsername, setNewUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const usernameRegex = /^[A-Za-z0-9._-]{3,30}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setInitialLoading(true);
      try {
        const res = await api.get(apiRoute);
        
        // DEBUG: log response to help diagnose missing email
        console.debug("EditForm: load response", res?.data);

        if (!mounted) return;
        const data = res.data || {};
        
        if (data.username) setCurrentUsername(data.username);
        
        // Try several common places for email in API responses
        const maybeEmail =
          data.email ||
          (data.user && data.user.email) ||
          data.email_address ||
          data.emailAddress ||
          "";

        if (maybeEmail) {
          setEmail(maybeEmail);
        }

        // update local cache best-effort
        try {
          const userRaw = localStorage.getItem("user");
          if (userRaw) {
            const u = JSON.parse(userRaw);
            const updated = { ...u };
            if (!updated.username && data.username) updated.username = data.username;
            if (!updated.email && maybeEmail) updated.email = maybeEmail;
            localStorage.setItem("user", JSON.stringify(updated));
          }
        } catch {}
      } catch (err) {
        // ignore: user may be unauthenticated or token expired
        console.debug("EditForm: load error", err?.response?.data || err.message);
      } finally {
        if (mounted) setInitialLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [apiRoute]);

  const validate = () => {
    let ok = true;
    setUsernameError("");
    setPasswordError("");
    setConfirmError("");
    setSuccessMessage("");

    const name = newUsername.trim();
    const usernameChanged = name && name !== currentUsername;
    const wantsPasswordChange = !!(currentPassword || newPassword || confirmPassword);

    if (usernameChanged && !usernameRegex.test(name)) {
      setUsernameError("Username must be 3-30 chars: letters, numbers, . _ -");
      ok = false;
    }

    if (wantsPasswordChange) {
      if (!currentPassword) {
        setPasswordError("Current password is required");
        ok = false;
      }
      if (!newPassword) {
        setPasswordError("New password is required");
        ok = false;
      } else if (!passwordRegex.test(newPassword)) {
        setPasswordError("New password must contain letters, numbers, and a special character (min 8 chars)");
        ok = false;
      }
      if (newPassword !== confirmPassword) {
        setConfirmError("Passwords do not match");
        ok = false;
      }
    }

    if (!usernameChanged && !wantsPasswordChange) {
      setUsernameError("Change username or update password to submit");
      ok = false;
    }

    return ok;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const name = newUsername.trim();
    const usernameChanged = name && name !== currentUsername;
    const wantsPasswordChange = !!(currentPassword && newPassword && confirmPassword);

    setLoading(true);
    try {
      // Update username if changed
      if (usernameChanged) {
        await api.patch(apiRoute, { username: name });
        setCurrentUsername(name);
        // update local cache best-effort
        try {
          const userRaw = localStorage.getItem("user");
          if (userRaw) {
            const u = JSON.parse(userRaw);
            localStorage.setItem("user", JSON.stringify({ ...u, username: name }));
          } else {
            localStorage.setItem("username", name);
          }
        } catch {}
      }

      // Change password if requested
      if (wantsPasswordChange) {
        let pwdChanged = false;

        // Primary attempt: dedicated change-password endpoint
        try {
          await api.post(pwdRoute, {
            current_password: currentPassword,
            new_password: newPassword,
          });
          pwdChanged = true;
        } catch (err) {
          const status = err?.response?.status;
          // If endpoint not found or not allowed, try fallback: update user via account PATCH
          if (status === 404 || status === 405) {
            // Try a few common payload shapes for backend that supports password via user update
            const fallbacks = [
              { password: newPassword, current_password: currentPassword },
              { new_password: newPassword, current_password: currentPassword },
              { password: newPassword }, // some backends accept direct password field
            ];
            
            for (const payload of fallbacks) {
              try {
                await api.patch(apiRoute, payload);
                pwdChanged = true;
                break;
              } catch (err2) {
                // continue trying next fallback
                console.debug("Fallback failed:", payload, err2?.response?.data);
              }
            }
          } else {
            // rethrow non-404/405 errors to be handled below
            throw err;
          }
        }

        if (!pwdChanged) {
          // nothing worked — provide helpful error
          throw {
            _custom: true,
            message:
              "Password change failed. The backend does not expose /auth/change-password/ and user-update attempts failed. Please use 'Forgot password' or ask admin to enable a password-change endpoint.",
          };
        }
      }

      setSuccessMessage("Account updated successfully.");
      setNewUsername("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const data = err?.response?.data || {};
      if (data.username) setUsernameError(Array.isArray(data.username) ? data.username[0] : String(data.username));
      if (data.current_password) setPasswordError(Array.isArray(data.current_password) ? data.current_password[0] : String(data.current_password));
      if (data.new_password) setPasswordError(Array.isArray(data.new_password) ? data.new_password[0] : String(data.new_password));
      if (err?._custom?.message) {
        setPasswordError(err._custom.message);
      } else if (!data.username && !data.current_password && !data.new_password) {
        setPasswordError("Update failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setNewUsername("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setUsernameError("");
    setPasswordError("");
    setConfirmError("");
    setSuccessMessage("");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (initialLoading) {
    return (
      <div className="profile-section">
        <h2>Account Settings</h2>
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="profile-section">
      <h2>Account Settings</h2>
      <div className="profile-form-container">
        <h3>Update Account Information</h3>

        <form id="accountForm" className="profile-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="current-username">Current Username</label>
            <input type="text" id="current-username" value={currentUsername} readOnly />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} readOnly />
          </div>

          <div className="form-group">
            <label htmlFor="new-username">New Username</label>
            <input
              type="text"
              id="new-username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Enter a new username"
            />
            <div className="error-message" id="username-error">{usernameError}</div>
          </div>

          <div className="form-group">
            <label htmlFor="current-password">Current Password</label>
            <input
              type="password"
              id="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password (required to change password)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="new-password">New Password</label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
            <div className="error-message" id="password-error">{passwordError}</div>
            <div className="password-hint">Password must contain letters, numbers, and at least one special character</div>
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">Confirm New Password</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
            />
            <div className="error-message" id="confirm-password-error">{confirmError}</div>
          </div>

          <div className="form-actions">
            <button type="submit" className="button button-primary" disabled={loading}>
              {loading ? "Updating..." : "Update Account"}
            </button>
            <button
              type="button"
              className="button"
              onClick={handleReset}
              disabled={loading}
            >
              Reset
            </button>
            <button
              type="button"
              className="button button-danger"
              onClick={handleLogout}
              disabled={loading}
            >
              Logout
            </button>
          </div>

          {loading && <LoadingIndicator />}
          {successMessage && <div className="success-message" id="form-success">{successMessage}</div>}
        </form>
      </div>
    </div>
  );
}