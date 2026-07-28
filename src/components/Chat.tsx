import { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { collection, addDoc, query, where, onSnapshot, orderBy, doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

interface Message { id: string; text: string; createdAt: Date; starred?: boolean; pinned?: boolean; }
interface MessageContextMenu { messageId: string; x: number; y: number; }

const formatDate = (date: Date) => {
  const now = new Date(); const diff = now.getTime() - date.getTime(); const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today"; if (days === 1) return "Yesterday";
  return date.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" });
};
const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const Chat = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { state } = useLocation();
  const groupName = state?.groupName || "Chat";
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [contextMenu, setContextMenu] = useState<MessageContextMenu | null>(null);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
  useEffect(() => { scrollToBottom(); }, [messages]);

  useEffect(() => {
    const handleClickOutside = () => { if (contextMenu) setContextMenu(null); };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [contextMenu]);

  useEffect(() => {
    if (!groupId) return;
    const q = query(collection(db, "messages"), where("groupId", "==", groupId), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => { const data = doc.data(); return { id: doc.id, text: data.text, createdAt: data.createdAt.toDate(), starred: data.starred, pinned: data.pinned }; }));
    });
    return unsubscribe;
  }, [groupId]);

  useEffect(() => {
    const checkAccess = async () => {
      if (!groupId || !user) return;
      const groupRef = doc(db, "groups", groupId);
      const groupSnap = await getDoc(groupRef);
      if (!groupSnap.exists()) { navigate("/", { replace: true }); return; }
      if (groupSnap.data().userId !== user.uid) { navigate("/", { replace: true }); }
    };
    checkAccess();
  }, [groupId, user, navigate]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !groupId || !newMessage.trim()) return;
    await addDoc(collection(db, "messages"), { groupId, text: newMessage.trim(), userId: user.uid, createdAt: new Date(), starred: false, pinned: false });
    setNewMessage("");
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!user) return;
    if (confirm("Are you sure you want to delete this message?")) { await deleteDoc(doc(db, "messages", messageId)); }
    setContextMenu(null);
  };

  const handleToggleStar = async (messageId: string) => {
    if (!user) return;
    const msgRef = doc(db, "messages", messageId);
    const msgSnap = await getDoc(msgRef);
    if (msgSnap.exists()) { await updateDoc(msgRef, { starred: !msgSnap.data().starred }); }
    setContextMenu(null);
  };

  const handleTogglePin = async (messageId: string) => {
    if (!user) return;
    const msgRef = doc(db, "messages", messageId);
    const msgSnap = await getDoc(msgRef);
    if (msgSnap.exists()) { await updateDoc(msgRef, { pinned: !msgSnap.data().pinned }); }
    setContextMenu(null);
  };

  const handleContextMenu = (e: React.MouseEvent, messageId: string) => {
    e.preventDefault(); setContextMenu({ messageId, x: e.clientX, y: e.clientY });
  };

  const groupedMessages = messages.reduce<(Date | Message)[]>((acc, msg, i) => {
    if (i === 0) { acc.push(msg.createdAt); acc.push(msg); return acc; }
    if (msg.createdAt.toDateString() !== messages[i - 1].createdAt.toDateString()) { acc.push(msg.createdAt); }
    acc.push(msg); return acc;
  }, []);

  const pinnedMessages = messages.filter((m) => m.pinned);
  const backgroundPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23667781' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "12px 16px", backgroundColor: "var(--dark-green)", color: "#fff", display: "flex", alignItems: "center", gap: "12px" }}>
        <button onClick={() => navigate("/")} style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer", padding: "4px", display: "flex", alignItems: "center" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        </button>
        <div style={{ width: "44px", height: "44px", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>{groupName.charAt(0).toUpperCase()}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: "16px" }}>{groupName}</div>
          <div style={{ fontSize: "13px", opacity: 0.8 }}>{messages.length} items</div>
        </div>
      </div>

      {pinnedMessages.length > 0 && (
        <div style={{ padding: "10px 16px", backgroundColor: "#e1f2fb", borderBottom: "1px solid #b3d9f2", display: "flex", alignItems: "center", gap: "8px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--primary-green)" stroke="var(--primary-green)" strokeWidth="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
          <span style={{ fontSize: "13px", fontWeight: 500 }}>{pinnedMessages.length} pinned message{pinnedMessages.length > 1 ? "s" : ""}</span>
        </div>
      )}

      <div style={{ flex: 1, padding: "16px", paddingBottom: "24px", overflowY: "auto", backgroundColor: "#f0f2f5", backgroundImage: backgroundPattern, display: "flex", flexDirection: "column", gap: "4px" }}>
        {groupedMessages.map((item, idx) => {
          if (item instanceof Date) { return <div key={`date-${idx}`} className="date-separator"><span>{formatDate(item)}</span></div>; }
          const msg = item as Message;
          return (
            <div key={msg.id} className="chat-bubble sent" style={{ marginTop: "4px" }} onContextMenu={(e) => handleContextMenu(e, msg.id)}>
              {msg.pinned && <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "6px" }}><svg width="12" height="12" viewBox="0 0 24 24" fill="var(--primary-green)" stroke="var(--primary-green)" strokeWidth="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg><span style={{ fontSize: "11px", color: "var(--primary-green)", fontWeight: 500 }}>Pinned</span></div>}
              <div style={{ fontSize: "15px", whiteSpace: "pre-wrap", wordBreak: "break-word", lineHeight: 1.5 }}>{msg.text}</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "6px", marginTop: "6px" }}>
                {msg.starred && <svg width="14" height="14" viewBox="0 0 24 24" fill="#ffc107" stroke="#ffc107" strokeWidth="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>}
                <span style={{ fontSize: "11px", color: "#667781" }}>{formatTime(msg.createdAt)}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#667781" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="message-input-container">
        <button className="message-input-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
        </button>
        <div className="message-input-wrapper">
          <input type="text" className="message-input" placeholder="Type something..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
          <button className="message-input-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
          </button>
        </div>
        <button className="message-input-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
        </button>
        <button className="message-send-btn" disabled={!newMessage.trim()} onClick={handleSendMessage}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
        </button>
      </div>

      {contextMenu && (
        <div className="context-menu-overlay" onClick={() => setContextMenu(null)}>
          <div className="context-menu" onClick={(e) => e.stopPropagation()} style={{ position: "fixed", left: Math.min(contextMenu.x, window.innerWidth - 340), top: Math.min(contextMenu.y, window.innerHeight - 300) }}>
            <div className="context-menu-actions">
              <button className="context-menu-action" onClick={() => handleToggleStar(contextMenu.messageId)}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#ffc107" stroke="#ffc107" strokeWidth="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg> Star
              </button>
              <button className="context-menu-action" onClick={() => handleTogglePin(contextMenu.messageId)}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg> Pin
              </button>
              <button className="context-menu-action" onClick={() => setContextMenu(null)}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg> Share
              </button>
            </div>
            <button className="context-menu-delete" onClick={() => handleDeleteMessage(contextMenu.messageId)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;