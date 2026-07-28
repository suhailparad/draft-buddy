import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import GroupsList from "./components/GroupsList";
import Chat from "./components/Chat";

function App() {
  const { user, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  if (loading) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #075e54 0%, #008069 100%)" }}>
        <div style={{ textAlign: "center", color: "#fff" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>💬</div>
          <div style={{ fontSize: "18px", fontWeight: 500 }}>Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return showRegister ? <Register onSwitch={() => setShowRegister(false)} /> : <Login onSwitch={() => setShowRegister(true)} />;
  }

  const handleNavigate = (tab: string) => { setActiveTab(tab); };

  const BottomNav = () => (
    <div className="bottom-nav">
      <button className={`nav-item ${activeTab === "home" ? "active" : ""}`} onClick={() => setActiveTab("home")}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill={activeTab === "home" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
        Home
      </button>
      <button className={`nav-item ${activeTab === "groups" ? "active" : ""}`} onClick={() => setActiveTab("groups")}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
        Groups
      </button>
      <button className="nav-fab" onClick={() => setActiveTab("groups")}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
      </button>
      <button className={`nav-item ${activeTab === "favorites" ? "active" : ""}`} onClick={() => setActiveTab("favorites")}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill={activeTab === "favorites" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
        Favorites
      </button>
      <button className={`nav-item ${activeTab === "settings" ? "active" : ""}`} onClick={() => setActiveTab("settings")}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
        Settings
      </button>
    </div>
  );

  return (
    <div style={{ height: "100vh", width: "100vw", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        {activeTab === "home" && <Home onNavigate={handleNavigate} />}
        {activeTab === "groups" && <GroupsList onNavigate={handleNavigate} />}
        {activeTab === "favorites" && (
          <div style={{ padding: "20px", textAlign: "center", paddingTop: "60px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>⭐</div>
            <h2 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "8px" }}>Favorites</h2>
            <p style={{ color: "var(--text-secondary)" }}>Star your favorite items to find them easily</p>
          </div>
        )}
        {activeTab === "settings" && (
          <div style={{ padding: "20px", textAlign: "center", paddingTop: "60px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚙️</div>
            <h2 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "8px" }}>Settings</h2>
            <p style={{ color: "var(--text-secondary)" }}>Customize your Draft Buddy experience</p>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}

export default App;