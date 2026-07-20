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
// @ts-expect-error - Fix for missing @microlink/react type declarations
import Microlink from "@microlink/react";
import Linkify from "linkify-react";


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
  const [activeMessageDropdownId, setActiveMessageDropdownId] = useState<
    string | null
  >(null);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatDropdownRef = useRef<HTMLDivElement>(null);

  // Background pattern SVG data URL
  const backgroundPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23667781' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        chatDropdownRef.current &&
        !chatDropdownRef.current.contains(event.target as Node)
      ) {
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
    setActiveMessageDropdownId(null);
  };

  const getFirstUrl = (text: string) => {
    const match = text.match(
      /((https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[^\s]*)?)/i
    );

    if (!match) return null;

    let url = match[0];

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`;
    }

    return url;
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "12px 16px",
          backgroundColor: "var(--dark-green)",
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
            padding: "4px",
          }}
        >
          ←
        </button>
        <div
          style={{
            width: "44px",
            height: "44px",
            backgroundColor: "rgba(255,255,255,0.2)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: "20px",
            fontWeight: "600",
          }}
        >
          {groupName.charAt(0).toUpperCase()}
        </div>
        <div style={{ flex: "1" }}>
          <div style={{ fontWeight: 600, fontSize: "16px" }}>{groupName}</div>
          <div style={{ fontSize: "13px", opacity: 0.8 }}>
            {messages.length} items
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: "20px",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            ⋮
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div
        style={{
          flex: "1",
          padding: "16px",
          paddingBottom: "24px",
          overflowY: "auto",
          backgroundColor: "#f0f2f5",
          backgroundImage: backgroundPattern,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
        ref={chatDropdownRef}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              maxWidth: "75%",
              padding: "10px 14px",
              borderRadius: "16px",
              borderTopRightRadius: "4px",
              backgroundColor: "#e0ffd5",
              alignSelf: "flex-end",
              position: "relative",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            <>
              {getFirstUrl(msg.text) && (
                <div style={{ marginBottom: "8px" }}>
                  <Microlink
                    url={getFirstUrl(msg.text)!}
                    size="large"
                    media="image"
                    lazy
                  />
                </div>
              )}

              <div
                style={{
                  marginBottom: "6px",
                  fontSize: "14px",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                <Linkify
                  options={{
                    target: "_blank",
                    rel: "noopener noreferrer",
                  }}
                >
                  {msg.text}
                </Linkify>
              </div>
            </>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "6px",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
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
                    setActiveMessageDropdownId(
                      activeMessageDropdownId === msg.id ? null : msg.id
                    );
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "2px 4px",
                    fontSize: "16px",
                    color: "#667781",
                    borderRadius: "50%",
                  }}
                >
                  ⋮
                </button>
                {activeMessageDropdownId === msg.id && (
                  <div
                    style={{
                      position: "absolute",
                      right: "0",
                      bottom: "100%",
                      marginBottom: "8px",
                      backgroundColor: "#fff",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                      borderRadius: "12px",
                      padding: "8px 0",
                      minWidth: "160px",
                      zIndex: 100,
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMessage(msg.id);
                      }}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        textAlign: "left",
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        fontSize: "14px",
                        color: "#dc2626",
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#fef2f2")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div
        style={{
          padding: "12px 16px",
          backgroundColor: "#fff",
          borderTop: "1px solid #f0f0f0",
        }}
      >
        <form
          onSubmit={handleSendMessage}
          style={{ display: "flex", gap: "10px", alignItems: "center" }}
        >
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            style={{
              flex: "1",
              padding: "12px 16px",
              backgroundColor: "#f0f2f5",
              border: "none",
              borderRadius: "24px",
              outline: "none",
              fontSize: "16px",
            }}
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            style={{
              backgroundColor: newMessage.trim()
                ? "var(--primary-green)"
                : "#e0e0e0",
              border: "none",
              borderRadius: "50%",
              width: "48px",
              height: "48px",
              color: "#fff",
              cursor: newMessage.trim() ? "pointer" : "not-allowed",
              fontSize: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background-color 0.2s",
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
