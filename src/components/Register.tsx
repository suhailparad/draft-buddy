import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Register = ({ onSwitch }: { onSwitch: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    try { await register(email, password); } catch { setError("Failed to register"); }
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: "0 0 40%", background: "linear-gradient(135deg, #075e54 0%, #008069 100%)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", color: "white" }}>
        <div style={{ width: "100px", height: "100px", borderRadius: "24px", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px" }}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none"><path d="M20 2H4C2.89543 2 2 2.89543 2 4V22L6 18H20C21.1046 18 22 17.1046 22 16V4C22 2.89543 21.1046 2 20 2Z" fill="white" /><path d="M7 9H17M7 13H13" stroke="#075e54" strokeWidth="2" strokeLinecap="round" /></svg>
        </div>
        <h1 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "4px" }}>Draft <span style={{ color: "#a7f3d0" }}>Buddy</span></h1>
        <p style={{ opacity: 0.9, fontSize: "15px" }}>Save ideas. Anytime. Anywhere.</p>
      </div>
      <div style={{ flex: 1, backgroundColor: "white", borderTopLeftRadius: "28px", borderTopRightRadius: "28px", padding: "32px 24px", marginTop: "-28px", position: "relative", overflowY: "auto" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 600, marginBottom: "6px" }}>Join us! 🚀</h2>
        <p style={{ fontSize: "14px", color: "#667781", marginBottom: "28px" }}>Create your account to start saving ideas</p>
        {error && <div style={{ backgroundColor: "#fef2f2", color: "#dc2626", padding: "12px 16px", borderRadius: "12px", marginBottom: "16px", fontSize: "14px" }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 500 }}>Email</label>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", border: "1px solid #e0e0e0", borderRadius: "14px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#667781" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 6L12 13L2 6" /></svg>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Enter your email" style={{ flex: 1, border: "none", outline: "none", fontSize: "15px" }} />
            </div>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 500 }}>Password</label>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", border: "1px solid #e0e0e0", borderRadius: "14px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#667781" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7C7 5.67 8.46 2.53 12 2C15.53 2.53 17 5.67 17 7V11" /></svg>
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Create your password" style={{ flex: 1, border: "none", outline: "none", fontSize: "15px" }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#667781", padding: "4px" }}>
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          <button type="submit" style={{ width: "100%", padding: "16px", backgroundColor: "var(--primary-green)", color: "white", border: "none", borderRadius: "14px", fontSize: "16px", fontWeight: 600, cursor: "pointer", marginTop: "8px" }}>Register</button>
        </form>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "28px 0" }}><div style={{ flex: 1, height: "1px", backgroundColor: "#e0e0e0" }} /><span style={{ fontSize: "13px", color: "#667781" }}>or continue with</span><div style={{ flex: 1, height: "1px", backgroundColor: "#e0e0e0" }} /></div>
        <button type="button" style={{ width: "100%", padding: "14px", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", border: "1px solid #e0e0e0", borderRadius: "14px", backgroundColor: "white", cursor: "pointer", fontSize: "15px", fontWeight: 500 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
          Continue with Google
        </button>
        <p style={{ textAlign: "center", fontSize: "14px", color: "#667781", marginTop: "28px" }}>Already have an account? <button onClick={onSwitch} style={{ background: "transparent", border: "none", color: "var(--primary-green)", cursor: "pointer", fontWeight: 600 }}>Login</button></p>
      </div>
    </div>
  );
};
export default Register;