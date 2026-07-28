import { useState, useEffect, useRef } from "react";
import { collection, addDoc, query, where, onSnapshot, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

interface Group { id: string; name: string; createdAt: Date; itemCount?: number; pinned?: boolean; }

const GROUP_ICONS: Record<string, { emoji: string; color: string }> = {
  "shopping list": { emoji: "\u{1F6D2}", color: "#e8f5e9" }, movies: { emoji: "\u{1F3AC}", color: "#fce4ec" },
  recipes: { emoji: "\u{1F37D}\uFE0F", color: "#fff3e0" }, books: { emoji: "\u{1F4DA}", color: "#e3f2fd" },
  links: { emoji: "\u{1F517}", color: "#f3e5f5" }, "places to visit": { emoji: "\u{1F4CD}", color: "#e8f5e9" },
  work: { emoji: "\u{1F4BC}", color: "#e3f2fd" }, ideas: { emoji: "\u{1F4A1}", color: "#fff3e0" },
};
const DEFAULT_ICON = { emoji: "\u{1F4CB}", color: "#e8f5e9" };
const getGroupIcon = (name: string) => { const lower = name.toLowerCase(); return GROUP_ICONS[lower] || DEFAULT_ICON; };
const formatTime = (date: Date) => {
  const now = new Date(); const diff = now.getTime() - date.getTime(); const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today"; else if (days === 1) return "Yesterday";
  else if (days < 7) return date.toLocaleDateString([], { weekday: "long" });
  else return date.toLocaleDateString([], { day: "2-digit", month: "2-digit", year: "numeric" });
};

interface GroupsListProps { onNavigate: (tab: string) => void; }
const GroupsList = ({ onNavigate }: GroupsListProps) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingGroupName, setEditingGroupName] = useState("");
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const { user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const groupsQuery = query(collection(db, "groups"), where("userId", "==", user.uid), orderBy("createdAt", "desc"));
    const unsubscribeGroups = onSnapshot(groupsQuery, async (snapshot) => {
      const groupsData: Group[] = await Promise.all(snapshot.docs.map(async (docSnapshot) => {
        const data = docSnapshot.data();
        const group: Group = { id: docSnapshot.id, name: data.name, createdAt: data.createdAt.toDate(), pinned: data.pinned };
        const messagesQuery = query(collection(db, "messages"), where("groupId", "==", group.id));
        const messagesSnapshot = await new Promise<number>((resolve) => { const unsub = onSnapshot(messagesQuery, (snap) => { resolve(snap.size); unsub(); }); });
        return { ...group, itemCount: messagesSnapshot };
      }));
      setGroups(groupsData);
    });
    return unsubscribeGroups;
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) { setActiveDropdownId(null); }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newGroupName.trim()) return;
    await addDoc(collection(db, "groups"), { name: newGroupName.trim(), userId: user.uid, createdAt: new Date(), pinned: false });
    setNewGroupName(""); setShowAddModal(false);
  };

  const handleSaveEdit = async (e: React.FormEvent, groupId: string) => {
    e.preventDefault(); e.stopPropagation();
    if (!user || !editingGroupName.trim()) return;
    await updateDoc(doc(db, "groups", groupId), { name: editingGroupName.trim() });
    setEditingGroupId(null); setEditingGroupName("");
  };

  const handleDeleteGroup = async (e: React.MouseEvent, groupId: string) => {
    e.stopPropagation();
    if (!user) return;
    if (confirm("Are you sure you want to delete this group?")) { await deleteDoc(doc(db, "groups", groupId)); }
    setActiveDropdownId(null);
  };

  const handleTogglePin = async (e: React.MouseEvent, group: Group) => {
    e.stopPropagation();
    if (!user) return;
    await updateDoc(doc(db, "groups", group.id), { pinned: !group.pinned });
    setActiveDropdownId(null);
  };

  const filteredGroups = groups.filter((g) => {
    const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeFilter === "All") return matchesSearch;
    if (activeFilter === "Pinned") return matchesSearch && g.pinned;
    if (activeFilter === "Recent") { const days = Math.floor((Date.now() - g.createdAt.getTime()) / (1000 * 60 * 60 * 24)); return matchesSearch && days <= 7; }
    return matchesSearch;
  });

  const handleLogout = async () => { try { await logout(); } catch (error) { console.error(error); } };

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff" }}>
        <h2 style={{ fontSize: "24px", fontWeight: 700 }}>Groups</h2>
        <button onClick={handleLogout} style={{ background: "transparent", border: "none", color: "#dc2626", cursor: "pointer", padding: "8px", fontSize: "14px", fontWeight: 500 }}>Logout</button>
      </div>

      <div style={{ padding: "0 16px 12px", backgroundColor: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", backgroundColor: "var(--hover-bg)", borderRadius: "12px" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#667781" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
          <input type="text" placeholder="Search groups..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ flex: 1, border: "none", outline: "none", backgroundColor: "transparent", fontSize: "15px" }} />
        </div>
      </div>

      <div className="filter-tabs">
        {["All", "Pinned", "Recent", "Smart"].map((filter) => (
          <button key={filter} className={`filter-tab ${activeFilter === filter ? "active" : ""}`} onClick={() => setActiveFilter(filter)}>{filter}</button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto", paddingBottom: "80px" }}>
        {filteredGroups.map((group) => {
          const icon = getGroupIcon(group.name);
          return (
            <div
              key={group.id}
              style={{ padding: "14px 16px", borderBottom: "1px solid var(--border-color)", backgroundColor: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}
              onClick={() => { if (editingGroupId !== group.id) navigate(`/chat/${group.id}`, { state: { groupName: group.name } }); }}
            >
              <div className="group-icon" style={{ background: icon.color }}>{icon.emoji}</div>

              {editingGroupId === group.id ? (
                <form onSubmit={(e) => handleSaveEdit(e, group.id)} style={{ flex: 1, display: "flex", gap: "8px", alignItems: "center" }} onClick={(e) => e.stopPropagation()}>
                  <input type="text" value={editingGroupName} onChange={(e) => setEditingGroupName(e.target.value)} autoFocus style={{ flex: 1, padding: "10px 14px", border: "2px solid var(--primary-green)", borderRadius: "10px", outline: "none", fontSize: "15px" }} />
                  <button type="submit" style={{ padding: "10px 16px", backgroundColor: "var(--primary-green)", color: "#fff", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>Save</button>
                  <button type="button" onClick={(e) => { e.stopPropagation(); setEditingGroupId(null); setEditingGroupName(""); }} style={{ padding: "10px 14px", backgroundColor: "var(--hover-bg)", border: "none", borderRadius: "10px", fontSize: "14px", cursor: "pointer" }}>Cancel</button>
                </form>
              ) : (
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{ fontWeight: 500, fontSize: "16px" }}>{group.name}</div>
                    {group.pinned && <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--primary-green)" stroke="var(--primary-green)" strokeWidth="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>}
                  </div>
                  <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{group.itemCount || 0} items</span>
                </div>
              )}

              {editingGroupId !== group.id && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                  <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{formatTime(group.createdAt)}</span>
                  <div ref={dropdownRef} style={{ position: "relative" }}>
                    <button onClick={(e) => { e.stopPropagation(); setActiveDropdownId(activeDropdownId === group.id ? null : group.id); }} style={{ background: "transparent", border: "none", padding: "6px", cursor: "pointer", color: "var(--text-secondary)", borderRadius: "50%" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" /></svg>
                    </button>
                    {activeDropdownId === group.id && (
                      <div style={{ position: "absolute", right: 0, top: "100%", backgroundColor: "#fff", boxShadow: "0 4px 16px rgba(0,0,0,0.12)", borderRadius: "12px", padding: "6px 0", minWidth: "160px", zIndex: 100 }}>
                        <button onClick={(e) => { e.stopPropagation(); setEditingGroupId(group.id); setEditingGroupName(group.name); setActiveDropdownId(null); }} style={{ width: "100%", padding: "12px 16px", textAlign: "left", border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px", fontSize: "14px" }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg> Edit
                        </button>
                        <button onClick={(e) => handleTogglePin(e, group)} style={{ width: "100%", padding: "12px 16px", textAlign: "left", border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px", fontSize: "14px" }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill={group.pinned ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg> {group.pinned ? "Unpin" : "Pin"}
                        </button>
                        <button onClick={(e) => handleDeleteGroup(e, group.id)} style={{ width: "100%", padding: "12px 16px", textAlign: "left", border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", color: "#dc2626" }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filteredGroups.length === 0 && <div style={{ padding: "40px 20px", textAlign: "center" }}><div style={{ fontSize: "48px", marginBottom: "16px" }}>📝</div><p style={{ color: "var(--text-secondary)", fontSize: "15px" }}>{searchQuery ? "No groups found" : "No groups yet. Create one!"}</p></div>}
      </div>

      <button className="fab" onClick={() => setShowAddModal(true)}><span>+</span></button>

      {showAddModal && (
        <div className="bottom-sheet-overlay" onClick={() => setShowAddModal(false)}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="bottom-sheet-handle" />
            <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "20px", padding: "0 8px" }}>Create New Group</h3>
            <form onSubmit={handleAddGroup}>
              <input type="text" placeholder="Enter group name..." value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} autoFocus style={{ width: "100%", padding: "14px 16px", border: "1px solid var(--border-color)", borderRadius: "12px", marginBottom: "20px", fontSize: "15px", outline: "none" }} />
              <div style={{ display: "flex", gap: "12px" }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: "14px", backgroundColor: "var(--hover-bg)", border: "none", borderRadius: "12px", cursor: "pointer", fontSize: "15px", fontWeight: 500 }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: "14px", backgroundColor: "var(--primary-green)", color: "#fff", border: "none", borderRadius: "12px", cursor: "pointer", fontSize: "15px", fontWeight: 600 }}>Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupsList;