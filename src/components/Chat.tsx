import { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

interface Message {
  id: string;
  text: string;
  createdAt: Date;
}

const Chat = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { state } = useLocation();
  const groupName = state?.groupName || "Chat";
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeMessageDropdownId, setActiveMessageDropdownId] = useState<string | null>(null);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatDropdownRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatDropdownRef.current && !chatDropdownRef.current.contains(event.target as Node)) {
        setActiveMessageDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!groupId) return;

    const q = query(
      collection(db, "messages"),
      where("groupId", "==", groupId),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          text: doc.data().text,
          createdAt: doc.data().createdAt.toDate(),
        }))
      );
    });
    return unsubscribe;
  }, [groupId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !groupId || !newMessage.trim()) return;
    await addDoc(collection(db, "messages"), {
      groupId,
      text: newMessage.trim(),
      userId: user.uid,
      createdAt: new Date(),
    });
    setNewMessage("");
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!user) return;
    if (confirm("Are you sure you want to delete this message?")) {
      await deleteDoc(doc(db, "messages", messageId));
    }
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: "#f0f2f5",
      }}
    >
      <div
        style={{
          padding: "16px",
          backgroundColor: "#008069",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            background: "transparent",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            fontSize: "24px",
          }}
        >
          ←
        </button>
        <div
          style={{
            width: "40px",
            height: "40px",
            backgroundColor: "#fff",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#008069",
            fontSize: "18px",
          }}
        >
          {groupName.charAt(0).toUpperCase()}
        </div>
        <h3>{groupName}</h3>
      </div>

      <div
        style={{
          flex: 1,
          padding: "16px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
        ref={chatDropdownRef}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              maxWidth: "70%",
              padding: "8px 12px",
              borderRadius: "8px",
              backgroundColor: "#d9fdd3",
              alignSelf: "flex-end",
              position: "relative",
            }}
          >
            <div style={{ marginBottom: "4px" }}>{msg.text}</div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "4px",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  color: "#667781",
                  textAlign: "right",
                }}
              >
                {msg.createdAt.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div style={{ position: "relative" }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMessageDropdownId(activeMessageDropdownId === msg.id ? null : msg.id);
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "0 4px",
                    fontSize: "16px",
                    color: "#667781",
                  }}
                >
                  ⋮
                </button>
                {activeMessageDropdownId === msg.id && (
                  <div
                    style={{
                      position: "absolute",
                      right: "0",
                      top: "-120%",
                      backgroundColor: "#fff",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                      borderRadius: "8px",
                      padding: "8px 0",
                      minWidth: "150px",
                      zIndex: 100,
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMessage(msg.id);
                        setActiveMessageDropdownId(null);
                      }}
                      style={{
                        width: "100%",
                        padding: "10px 16px",
                        textAlign: "left",
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "#dc2626",
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: "16px" }}>
        <form onSubmit={handleSendMessage} style={{ display: "flex", gap: "8px" }}>
          <input
            type="text"
            placeholder="Type a message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            style={{
              flex: 1,
              padding: "12px 16px",
              border: "none",
              borderRadius: "24px",
              outline: "none",
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: "#008069",
              border: "none",
              borderRadius: "50%",
              width: "48px",
              height: "48px",
              color: "#fff",
              cursor: "pointer",
              fontSize: "20px",
            }}
          >
            ➤
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
