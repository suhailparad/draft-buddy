import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

interface Group { id: string; name: string; createdAt: Date; itemCount?: number; emoji?: string; color?: string; pinned?: boolean; }
interface RecentItem { id: string; text: string; groupId: string; groupName: string; createdAt: Date; }

const GROUP_ICONS: Record<string, { emoji: string; color: string }> = {
  "shopping list": { emoji: "🛒", color: "#e8f5e9" }, movies: { emoji: "🎬", color: "#fce4ec" },
  recipes: { emoji: "🍽️", color: "#fff3e0" }, books: { emoji: "📚", color: "#e3f2fd" },
  links: { emoji: "🔗", color: "#f3e5f5" }, "places to visit": { emoji: "📍", color: "#e8f5e9" },
  work: { emoji: "💼", color: "#e3f2fd" }, ideas: { emoji: "💡", color: "#fff3e0" },
};
const DEFAULT_ICON = { emoji: "📋", color: "#e8f5e9" };
const getGroupIcon = (name: string) => { const lower = name.toLowerCase(); return GROUP_ICONS[lower] || DEFAULT_ICON; };
const getGreeting = () => { const hour = new Date().getHours(); if (hour < 12) return "Good morning"; if (hour < 17) return "Good afternoon"; return "Good evening"; };
const formatTime = (date: Date) => { const now = new Date(); const diff = now.getTime() - date.getTime(); const days = Math.floor(diff / (1000 * 60 * 60 * 24)); if (days === 0) return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); else if (days === 1) return "Yesterday"; else if (days < 7) return date.toLocaleDateString([], { weekday: "long" }); else return date.toLocaleDateString([], { day: "2-digit", month: "2-digit", year: "numeric" }); };

interface HomeProps { onNavigate: (tab: string) => void; }
const Home = ({ onNavigate }: HomeProps) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const groupsQuery = query(collection(db, "groups"), where("userId", "==", user.uid), orderBy("createdAt", "desc"));
    const unsubscribeGroups = onSnapshot(groupsQuery, async (snapshot) => {
      const groupsData: Group[] = await Promise.all(snapshot.docs.map(async (docSnapshot) => {
        const data = docSnapshot.data();
        const group: Group = { id: docSnapshot.id, name: data.name, createdAt: data.createdAt.toDate(), emoji: data.emoji, color: data.color, pinned: data.pinned };
        const messagesQuery = query(collection(db, "messages"), where("groupId", "==", group.id));
        const messagesSnapshot = await new Promise<number>((resolve) => { const unsub = onSnapshot(messagesQuery, (snap) => { resolve(snap.size); unsub(); }); });
        return { ...group, itemCount: messagesSnapshot };
      }));
      setGroups(groupsData);
    });
    return unsubscribeGroups;
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const groupsQuery = query(collection(db, "groups"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(groupsQuery, async (groupsSnapshot) => {
      const allItems: RecentItem[] = [];
      const groupMap: Record<string, string> = {};
      groupsSnapshot.docs.forEach((doc) => { groupMap[doc.id] = doc.data().name; });
      for (const groupDoc of groupsSnapshot.docs) {
        const messagesQuery = query(collection(db, "messages"), where("groupId", "==", groupDoc.id), orderBy("createdAt", "desc"));
        await new Promise<void>((resolve) => { const unsub = onSnapshot(messagesQuery, (snap) => { const latest = snap.docs[0]; if (latest) { const data = latest.data(); allItems.push({ id: latest.id, text: data.text, groupId: groupDoc.id, groupName: groupMap[groupDoc.id] || "Unknown", createdAt: data.createdAt.toDate() }); } unsub(); resolve(); }); });
      }
      allItems.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setRecentItems(allItems.slice(0, 5));
    });
    return unsubscribe;
  }, [user]);

  const pinnedGroups = groups.filter((g) => g.pinned);
  const displayGroups = groups.slice(0, 4);
  const displayName = user?.email?.split("@")[0] || "there";

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", overflowY: "auto", paddingBottom: "80px" }}>
      <div style={{ padding: "16px 16px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "4px" }}>{getGreeting()},</p>
          <h1 style={{ fontSize: "24px", fontWeight: 600 }}>{displayName} 👋</h1>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button style={{ background: "transparent", border: "none", padding: "8px", cursor: "pointer", color: "var(--text-primary)", position: "relative" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
            <span style={{ position: "absolute", top: "6px", right: "6px", width: "8px", height: "8px", background: "#dc2626", borderRadius: "50%" }} />
          </button>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #075e54 0%, #008069 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "16px", fontWeight: 600 }}>
            {displayName.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
      <div className="quick-capture" onClick={() => onNavigate("groups")} style={{ marginTop: "20px" }}>
        <div className="quick-capture-text"><h3>Quick Capture ✨</h3><p>Type anything, save everything...</p></div>
        <button className="quick-capture-btn"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg></button>
      </div>
      {pinnedGroups.length > 0 && (<div><div className="section-header"><h3>Pinned</h3><a onClick={() => onNavigate("groups")}>See all</a></div><div className="pinned-scroll">{pinnedGroups.map((group) => { const icon = getGroupIcon(group.name); return (<div key={group.id} className="pinned-card" onClick={() => navigate(`/chat/${group.id}`, { state: { groupName: group.name } })}><div className="pinned-card-icon" style={{ background: icon.color }}>{icon.emoji}</div><h4>{group.name}</h4><p>{group.itemCount || 0} items</p></div>); })}</div></div>)}
      {recentItems.length > 0 && (<div><div className="section-header"><h3>Recent</h3></div><div>{recentItems.map((item) => { const icon = getGroupIcon(item.groupName); return (<div key={item.id} className="recent-item" onClick={() => navigate(`/chat/${item.groupId}`, { state: { groupName: item.groupName } })}><div className="recent-item-icon" style={{ background: icon.color }}>{icon.emoji}</div><div className="recent-item-content"><h4>{item.text.substring(0, 40)}{item.text.length > 40 ? "..." : ""}</h4><p>{item.groupName}</p></div><div className="recent-item-meta"><span className="badge" style={{ background: icon.color, color: "var(--text-primary)" }}>{item.groupName}</span><div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>{formatTime(item.createdAt)}</div></div></div>); })}</div></div>)}
      {displayGroups.length > 0 && (<div><div className="section-header"><h3>Groups</h3><a onClick={() => onNavigate("groups")}>See all</a></div><div>{displayGroups.map((group) => { const icon = getGroupIcon(group.name); return (<div key={group.id} className="recent-item" onClick={() => navigate(`/chat/${group.id}`, { state: { groupName: group.name } })}><div className="recent-item-icon" style={{ background: icon.color }}>{icon.emoji}</div><div className="recent-item-content"><h4>{group.name}</h4><p>{group.itemCount || 0} items</p></div><div className="recent-item-meta"><div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{formatTime(group.createdAt)}</div></div></div>); })}</div></div>)}
    </div>
  );
};
export default Home;