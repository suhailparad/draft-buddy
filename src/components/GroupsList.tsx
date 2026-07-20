import { useState, useEffect, useRef } from "react";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

interface Group {
  id: string;
  name: string;
  createdAt: Date;
}

const GroupsList = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingGroupName, setEditingGroupName] = useState("");
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "groups"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setGroups(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          createdAt: doc.data().createdAt.toDate(),
        }))
      );
    });
    return unsubscribe;
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newGroupName.trim()) return;
    await addDoc(collection(db, "groups"), {
      name: newGroupName.trim(),
      userId: user.uid,
      createdAt: new Date(),
    });
    setNewGroupName("");
  };

  const handleEditGroup = (group: Group) => {
    setEditingGroupId(group.id);
    setEditingGroupName(group.name);
  };

  const handleSaveEdit = async (e: React.FormEvent, groupId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user || !editingGroupName.trim()) return;
    await updateDoc(doc(db, "groups", groupId), {
      name: editingGroupName.trim(),
    });
    setEditingGroupId(null);
    setEditingGroupName("");
  };

  const handleDeleteGroup = async (e: React.MouseEvent, groupId: string) => {
    e.stopPropagation();
    if (!user) return;
    if (confirm("Are you sure you want to delete this group?")) {
      await deleteDoc(doc(db, "groups", groupId));
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "16px",
          backgroundColor: "#008069",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3>Draft Buddy</h3>
        <button
          onClick={logout}
          style={{
            backgroundColor: "transparent",
            border: "1px solid #fff",
            color: "#fff",
            borderRadius: "4px",
            padding: "4px 8px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
      <div style={{ padding: "12px" }}>
        <form onSubmit={handleAddGroup} style={{ display: "flex", gap: "8px" }}>
          <input
            type="text"
            placeholder="New group name"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            style={{
              flex: 1,
              padding: "8px 12px",
              border: "1px solid #e0e0e0",
              borderRadius: "20px",
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: "#008069",
              border: "none",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              color: "#fff",
              cursor: "pointer",
              fontSize: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            +
          </button>
        </form>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {groups.map((group) => (
          <div
            key={group.id}
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid #f0f0f0",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f2f5")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <Link
              to={`/chat/${group.id}`}
              state={{ groupName: group.name }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flex: "1",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  backgroundColor: "#008069",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "20px",
                }}
              >
                {group.name.charAt(0).toUpperCase()}
              </div>
              {editingGroupId === group.id ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveEdit(e, group.id);
                  }}
                  style={{ flex: "1" }}
                  onClick={(e) => e.preventDefault()}
                >
                  <input
                    type="text"
                    value={editingGroupName}
                    onChange={(e) => setEditingGroupName(e.target.value)}
                    autoFocus
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                    style={{
                      width: "100%",
                      padding: "6px 8px",
                      border: "1px solid #008069",
                      borderRadius: "4px",
                      outline: "none",
                    }}
                  />
                </form>
              ) : (
                <div>
                  <div style={{ fontWeight: 500, marginBottom: "2px" }}>
                    {group.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "#667781" }}>
                    {group.createdAt.toLocaleDateString()}
                  </div>
                </div>
              )}
            </Link>
            <div style={{ position: "relative" }} ref={dropdownRef}>
              {editingGroupId !== group.id && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDropdownId(activeDropdownId === group.id ? null : group.id);
                    }}
                    style={{
                      background: "transparent",
                      border: "none",
                      padding: "4px",
                      cursor: "pointer",
                      color: "#667781",
                      fontSize: "20px",
                    }}
                  >
                    ⋮
                  </button>
                  {activeDropdownId === group.id && (
                    <div
                      style={{
                        position: "absolute",
                        right: "0",
                        top: "100%",
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
                          handleEditGroup(group);
                          setActiveDropdownId(null);
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
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteGroup(e, group.id);
                          setActiveDropdownId(null);
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
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupsList;
