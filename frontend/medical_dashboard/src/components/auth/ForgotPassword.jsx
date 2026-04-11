import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../api/authApi";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await forgotPassword({ email });
      setMessage(res.data.message || "Reset link sent to your email");
    } catch (err) {
      const apiError =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Something went wrong";

      setError(apiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="glass-panel p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Forgot Password
        </h2>

        <p className="text-sm text-slate-500 mb-6 text-center">
          Enter your email and we’ll send you a reset link
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* Success Message */}
        {message && (
          <p className="text-green-600 mt-4 text-center">{message}</p>
        )}

        {/* Error Message */}
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

export default ForgotPassword;
