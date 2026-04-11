import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../api/authApi";

const ResetPassword = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await resetPassword(uid, token, { password });
      setMessage(res.data.message || "Password reset successful");

      
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      const apiError =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Invalid or expired link";

      setError(apiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="glass-panel p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Reset Password
        </h2>

        <p className="text-sm text-slate-500 mb-6 text-center">
          Enter your new password
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <input
            type="password"
            placeholder="New Password"
            className="w-full px-4 py-2 border rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full px-4 py-2 border rounded-lg"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        
        {message && (
          <p className="text-green-600 mt-4 text-center">{message}</p>
        )}

  
        {error && (
          <p className="text-red-600 mt-4 text-center">{error}</p>
        )}

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="w-full mt-4 border border-slate-300 text-slate-700 py-2 rounded-lg hover:bg-slate-100 transition"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
