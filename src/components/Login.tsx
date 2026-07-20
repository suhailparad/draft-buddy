import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Login = ({ onSwitch }: { onSwitch: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ marginBottom: "20px", color: "#008069" }}>Login</h2>
      {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#008069",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Login
        </button>
      </form>
      <p style={{ marginTop: "15px", textAlign: "center" }}>
        Don't have an account?{" "}
        <button
          onClick={onSwitch}
          style={{
            background: "none",
            border: "none",
            color: "#008069",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          Register
        </button>
      </p>
    </div>
  );
};

export default Login;
