import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Login = ({ onSwitch }: { onSwitch: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
    } catch (err) {
      setError("Failed to log in");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top Section */}
      <div
        style={{
          height: "40%",
          backgroundColor: "var(--dark-green)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
        }}
      >
        <div
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.15)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <svg
            width="50"
            height="50"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 2H4C2.89543 2 2 2.89543 2 4V22L6 18H20C21.1046 18 22 17.1046 22 16V4C22 2.89543 21.1046 2 20 2Z"
              fill="white"
            />
            <path
              d="M7 9H17M7 13H13"
              stroke="var(--dark-green)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>Draft Buddy</h1>
        <p style={{ opacity: 0.9, fontSize: "16px" }}>
          Save ideas. Anytime. Anywhere.
        </p>
      </div>

      {/* Bottom Section */}
      <div
        style={{
          height: "60%",
          backgroundColor: "white",
          borderTopLeftRadius: "24px",
          borderTopRightRadius: "24px",
          padding: "32px 24px",
          marginTop: "-24px",
          position: "relative",
        }}
      >
        <h2 style={{ fontSize: "20px", marginBottom: "24px" }}>
          Welcome back! 👋
        </h2>
        <p style={{ fontSize: "14px", color: "#667781", marginBottom: "24px" }}>
          Login to your account
        </p>

        {error && (
          <p
            style={{
              color: "#dc2626",
              marginBottom: "16px",
              fontSize: "14px",
            }}
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Email
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                border: "1px solid #e0e0e0",
                borderRadius: "12px",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#667781"
                strokeWidth="2"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 6L12 13L2 6" />
              </svg>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                style={{
                  flex: "1",
                  border: "none",
                  outline: "none",
                  fontSize: "16px",
                }}
              />
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Password
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                border: "1px solid #e0e0e0",
                borderRadius: "12px",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#667781"
                strokeWidth="2"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" />
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                style={{
                  flex: "1",
                  border: "none",
                  outline: "none",
                  fontSize: "16px",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#667781",
                }}
              >
                {showPassword ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C5 20 1 12 1 12C2.24389 9.6819 3.96914 7.65661 6.06 6.06M14.12 3.12C13.3766 2.84404 12.5957 2.70344 11.8 2.7C11.1248 2.69637 10.4519 2.82583 9.8 3.08C5.5 4.5 2 8.5 2 12C2 12.6045 2.10377 13.1979 2.3 13.76" />
                    <path d="M4.5 4.5L19.5 19.5" />
                    <path d="M9.88 9.88C9.6924 10.1741 9.57191 10.5155 9.53687 10.8742C9.50182 11.2329 9.55391 11.5968 9.68762 11.9289C9.82133 12.261 10.0333 12.5498 10.3025 12.7655C10.5716 12.9811 10.8888 13.1166 11.2219 13.1566C11.555 13.1965 11.8918 13.139 12.1965 12.9926C12.5012 12.8462 12.7598 12.6162 12.94 12.33" />
                    <path d="M14.5 14.5C15.5018 13.9819 16.2891 13.0621 16.7357 11.9267C17.1823 10.7913 17.2641 9.50397 16.9648 8.25901C16.6654 7.01405 16.0032 5.88942 15.07 5" />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" />
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" />
                  </svg>
                )}
              </button>
            </div>
            <div style={{ textAlign: "right", marginTop: "8px" }}>
              <button
                type="button"
                style={{
                  fontSize: "12px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--primary-green)",
                }}
              >
                Forgot password?
              </button>
            </div>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: "var(--primary-green)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
              marginTop: "8px",
            }}
          >
            Login
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "24px 0" }}>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#e0e0e0" }} />
          <span style={{ fontSize: "12px", color: "#667781" }}>or continue with</span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#e0e0e0" }} />
        </div>

        {/* <button
          type="button"
          style={{
            width: "100%",
            padding: "12px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            border: "1px solid #e0e0e0",
            borderRadius: "12px",
            backgroundColor: "white",
            cursor: "pointer",
            fontSize: "14px",
            marginBottom: "24px",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button> */}

        <p style={{ textAlign: "center", fontSize: "14px", color: "#667781" }}>
          Don't have an account?{" "}
          <button
            onClick={onSwitch}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--primary-green)",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
