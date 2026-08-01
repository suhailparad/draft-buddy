import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Profile = () => {
  const {
    user,
    logout,
    updateProfileName,
    updateUserEmail,
    updateUserPassword,
    reauthenticateUser,
  } = useAuth();
  const navigate = useNavigate();

  // Profile info derived from auth user
  const displayName = user?.displayName || "";
  const emailAddr = user?.email || "";
  const avatarLetter = (displayName || emailAddr).charAt(0).toUpperCase();

  // ---- Account Information (name + email) ----
  const [name, setName] = useState(displayName);
  const [email, setEmail] = useState(emailAddr);
  const [accountMessage, setAccountMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [savingAccount, setSavingAccount] = useState(false);

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSavingAccount(true);
    setAccountMessage(null);
    try {
      await updateProfileName(name.trim());
      if (email.trim() !== emailAddr) {
        await updateUserEmail(email.trim());
      }
      setAccountMessage({ type: "success", text: "Changes saved." });
    } catch (error) {
      setAccountMessage({
        type: "error",
        text: "Failed to save changes. Please try again.",
      });
      console.error(error);
    } finally {
      setSavingAccount(false);
    }
  };

  // ---- Change Password ----
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    if (newPassword !== confirmPassword) {
      setPasswordMessage({
        type: "error",
        text: "New passwords do not match.",
      });
      return;
    }
    setSavingPassword(true);
    setPasswordMessage(null);
    try {
      await reauthenticateUser(currentPassword);
      await updateUserPassword(newPassword);
      setPasswordMessage({ type: "success", text: "Password updated." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setPasswordMessage({
        type: "error",
        text: "Failed to update password. Check your current password and try again.",
      });
      console.error(error);
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    }
  };

  // Shared input style with leading icon padding
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px 12px 44px",
    border: "1px solid #e0e0e0",
    borderRadius: "12px",
    fontSize: "16px",
    outline: "none",
    backgroundColor: "#fff",
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: "13px",
    fontWeight: 600,
    color: "#667781",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "8px",
    marginLeft: "4px",
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "20px",
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--bg-color)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px",
          backgroundColor: "var(--dark-green)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          position: "relative",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "transparent",
            border: "none",
            color: "#fff",
            fontSize: "22px",
            cursor: "pointer",
            padding: "4px",
          }}
          aria-label="Back"
        >
          ←
        </button>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 600,
            position: "absolute",
            left: 0,
            right: 0,
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          Profile
        </h2>
      </div>

      {/* Body */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px 16px 80px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          maxWidth: "560px",
          width: "100%",
          margin: "0 auto",
        }}
      >
        {/* Profile header */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "88px",
              height: "88px",
              borderRadius: "50%",
              backgroundColor: "var(--dark-green)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "38px",
              fontWeight: 600,
            }}
          >
            {avatarLetter || (
              <span className="material-symbols-outlined" style={{ fontSize: "48px" }}>
                account_circle
              </span>
            )}
          </div>
          <div style={{ marginTop: "14px", fontSize: "18px", fontWeight: 600 }}>
            {displayName || emailAddr}
          </div>
          <div style={{ fontSize: "13px", color: "#667781", marginTop: "4px" }}>
            Manage your account details
          </div>
        </div>

        {/* Account Information */}
        <div>
          <div style={sectionTitleStyle}>Account Information</div>
          <form onSubmit={handleSaveAccount} style={cardStyle}>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ position: "relative" }}>
                <span
                  className="material-symbols-outlined"
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#667781",
                    fontSize: "20px",
                    pointerEvents: "none",
                  }}
                >
                  person
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  style={inputStyle}
                />
              </div>
              <div style={{ position: "relative" }}>
                <span
                  className="material-symbols-outlined"
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#667781",
                    fontSize: "20px",
                    pointerEvents: "none",
                  }}
                >
                  mail
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={inputStyle}
                />
              </div>

              {accountMessage && (
                <div
                  style={{
                    fontSize: "13px",
                    color: accountMessage.type === "success" ? "#16a34a" : "#dc2626",
                  }}
                >
                  {accountMessage.text}
                </div>
              )}

              <button
                type="submit"
                disabled={savingAccount || !name.trim() || !email.trim()}
                style={{
                  marginTop: "4px",
                  padding: "12px",
                  backgroundColor: "var(--primary-green)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  cursor: savingAccount ? "not-allowed" : "pointer",
                  fontSize: "14px",
                  fontWeight: 600,
                  opacity:
                    savingAccount || !name.trim() || !email.trim() ? 0.6 : 1,
                }}
              >
                {savingAccount ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div>
          <div style={sectionTitleStyle}>Security</div>
          <div style={cardStyle}>
            <button
              type="button"
              onClick={() => setShowPasswordSection((s) => !s)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: 600,
                color: "#111",
                padding: 0,
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span className="material-symbols-outlined" style={{ color: "#667781" }}>
                  lock
                </span>
                Change Password
              </span>
              <span
                className="material-symbols-outlined"
                style={{
                  color: "#667781",
                  transition: "transform 0.2s",
                  transform: showPasswordSection ? "rotate(180deg)" : "none",
                }}
              >
                expand_more
              </span>
            </button>

            {showPasswordSection && (
              <form
                onSubmit={handleSavePassword}
                style={{
                  marginTop: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                {[
                  {
                    label: "Current Password",
                    value: currentPassword,
                    set: setCurrentPassword,
                    show: showCurrent,
                    toggle: () => setShowCurrent((s) => !s),
                  },
                  {
                    label: "New Password",
                    value: newPassword,
                    set: setNewPassword,
                    show: showNew,
                    toggle: () => setShowNew((s) => !s),
                  },
                  {
                    label: "Confirm New Password",
                    value: confirmPassword,
                    set: setConfirmPassword,
                    show: showConfirm,
                    toggle: () => setShowConfirm((s) => !s),
                  },
                ].map((field) => (
                  <div key={field.label}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        color: "#667781",
                        marginBottom: "6px",
                        marginLeft: "4px",
                      }}
                    >
                      {field.label}
                    </label>
                    <div style={{ position: "relative" }}>
                      <span
                        className="material-symbols-outlined"
                        style={{
                          position: "absolute",
                          left: "14px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#667781",
                          fontSize: "20px",
                          pointerEvents: "none",
                        }}
                      >
                        lock
                      </span>
                      <input
                        type={field.show ? "text" : "password"}
                        value={field.value}
                        onChange={(e) => field.set(e.target.value)}
                        placeholder="••••••••"
                        style={inputStyle}
                      />
                      <button
                        type="button"
                        onClick={field.toggle}
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          color: "#667781",
                          padding: "4px",
                          display: "flex",
                          alignItems: "center",
                        }}
                        aria-label={field.show ? "Hide password" : "Show password"}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                          {field.show ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>
                  </div>
                ))}

                <div
                  style={{
                    fontSize: "12px",
                    color: "#3b6e5b",
                    backgroundColor: "var(--light-green)",
                    borderRadius: "10px",
                    padding: "10px 12px",
                    display: "flex",
                    gap: "8px",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "16px", flexShrink: 0 }}
                  >
                    info
                  </span>
                  <span>
                    Use 8+ characters with a mix of letters, numbers, and symbols.
                    You'll need your current password to make this change.
                  </span>
                </div>

                {passwordMessage && (
                  <div
                    style={{
                      fontSize: "13px",
                      color:
                        passwordMessage.type === "success" ? "#16a34a" : "#dc2626",
                    }}
                  >
                    {passwordMessage.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={
                    savingPassword ||
                    !currentPassword ||
                    !newPassword ||
                    !confirmPassword
                  }
                  style={{
                    padding: "12px",
                    backgroundColor: "var(--primary-green)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    cursor: savingPassword ? "not-allowed" : "pointer",
                    fontSize: "14px",
                    fontWeight: 600,
                    opacity:
                      savingPassword ||
                      !currentPassword ||
                      !newPassword ||
                      !confirmPassword
                        ? 0.6
                        : 1,
                  }}
                >
                  {savingPassword ? "Saving..." : "Update Password"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            marginTop: "8px",
            padding: "14px",
            backgroundColor: "#fff",
            color: "#dc2626",
            border: "none",
            borderRadius: "16px",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <span className="material-symbols-outlined">logout</span>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
