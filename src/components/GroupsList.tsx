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
import { Link, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

interface Group {
  id: string;
  name: string;
  createdAt: Date;
  itemCount?: number;
}

const GroupsList = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingGroupName, setEditingGroupName] = useState("");
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    const groupsQuery = query(
      collection(db, "groups"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribeGroups = onSnapshot(groupsQuery, async (snapshot) => {
      const groupsData: Group[] = await Promise.all(
        snapshot.docs.map(async (docSnapshot) => {
          const group = {
            id: docSnapshot.id,
            name: docSnapshot.data().name,
            createdAt: docSnapshot.data().createdAt.toDate(),
          };

          // Fetch message count for each group
          const messagesQuery = query(
            collection(db, "messages"),
            where("groupId", "==", group.id)
          );
          const messagesSnapshot = await new Promise((resolve) => {
            const unsub = onSnapshot(messagesQuery, (snap) => {
              resolve(snap.size);
              unsub();
            });
          });

          return { ...group, itemCount: messagesSnapshot as number };
        })
      );
      setGroups(groupsData);
    });

    return unsubscribeGroups;
  }, [user]);

  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
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
    if (!user) return;

    if (editingGroupId) {
      // Editing an existing group
      if (!editingGroupName.trim()) return;
      await updateDoc(doc(db, "groups", editingGroupId), {
        name: editingGroupName.trim(),
      });
    } else {
      // Creating a new group
      if (!newGroupName.trim()) return;
      await addDoc(collection(db, "groups"), {
        name: newGroupName.trim(),
        userId: user.uid,
        createdAt: new Date(),
      });
    }

    setNewGroupName("");
    setEditingGroupId(null);
    setEditingGroupName("");
    setShowAddModal(false);
  };

  const handleEditGroup = (group: Group) => {
    setEditingGroupId(group.id);
    setEditingGroupName(group.name);
    setNewGroupName("");
    setActiveDropdownId(null);
    setShowAddModal(true);
  };

  const handleDeleteGroup = async (e: React.MouseEvent, groupId: string) => {
    e.stopPropagation();
    if (!user) return;
    if (confirm("Are you sure you want to delete this group?")) {
      await deleteDoc(doc(db, "groups", groupId));
    }
    setActiveDropdownId(null);
  };

  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px",
          backgroundColor: "var(--dark-green)",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontSize: "20px", fontWeight: 600 }}>Draft Buddy</h2>
        <button
          onClick={() => navigate("/profile")}
          style={{
            background: "transparent",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            padding: "4px",
            display: "flex",
            alignItems: "center",
          }}
          aria-label="Profile"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "26px" }}
          >
            account_circle
          </span>
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ padding: "12px", backgroundColor: "#fff" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: "12px 16px",
            backgroundColor: "#f0f2f5",
            borderRadius: "24px",
          }}
        >
          {/* <span style={{ fontSize: "16px" }}>🔍</span> */}
          <span className="material-symbols-outlined" style={{
            color:"#aaa",
          }}>
            search
          </span>
          
          <input
            type="text"
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: "1",
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
              fontSize: "16px",
            }}
          />
        </div>
      </div>

      {/* Groups List */}
      <div
        style={{
          flex: "1",
          overflowY: "auto",
          paddingBottom: "80px", // Space for bottom nav
        }}
      >
        {filteredGroups.map((group) => (
          <div
            key={group.id}
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid #f0f0f0",
              backgroundColor: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f2f5")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
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
                  width: "52px",
                  height: "52px",
                  backgroundColor: "var(--dark-green)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "22px",
                  fontWeight: 600,
                }}
              >
                {group.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: 500,
                    marginBottom: "4px",
                    fontSize: "16px",
                  }}
                >
                  {group.name}
                </div>
                <div style={{ fontSize: "13px", color: "#667781" }}>
                  {group.itemCount || 0} items
                </div>
              </div>
            </Link>
            <div
              style={{ position: "relative" }}
              ref={activeDropdownId === group.id ? dropdownRef : null}
            >
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDropdownId(
                      activeDropdownId === group.id ? null : group.id
                    );
                  }}
                    style={{
                      background: "transparent",
                      border: "none",
                      padding: "8px",
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
                          handleEditGroup(group);
                          setActiveDropdownId(null);
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
                          transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#f0f2f5")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "transparent")
                        }
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteGroup(e, group.id);
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
                </>
            </div>
          </div>
        ))}
      </div>

      {/* FAB for Add Group */}
      <button
        className="fab"
        onClick={() => {
          setEditingGroupId(null);
          setEditingGroupName("");
          setShowAddModal(true);
        }}
      >
        <span>+</span>
      </button>

      {/* Add Group Modal */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            inset: "0",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            padding: "16px",
            zIndex: 200,
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              width: "100%",
              padding: "24px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: "18px", marginBottom: "16px" }}>
              {editingGroupId ? "Edit Group" : "Create New Group"}
            </h3>
            <form onSubmit={handleAddGroup}>
              <input
                type="text"
                placeholder="Enter group name..."
                value={editingGroupId ? editingGroupName : newGroupName}
                onChange={(e) =>
                  editingGroupId
                    ? setEditingGroupName(e.target.value)
                    : setNewGroupName(e.target.value)
                }
                autoFocus
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "12px",
                  marginBottom: "16px",
                  fontSize:"16px",
                  outline: "none",
                }}
              />
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingGroupId(null);
                    setEditingGroupName("");
                    setNewGroupName("");
                  }}
                  style={{
                    flex: "1",
                    padding: "12px",
                    backgroundColor: "#f0f2f5",
                    border: "none",
                    borderRadius: "12px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: "1",
                    padding: "12px",
                    backgroundColor: "var(--primary-green)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  {editingGroupId ? "Save" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      {/* <div className="bottom-nav">
        <div
          className="nav-item active"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <span style={{ fontSize: "22px" }}>📋</span>
          <span style={{ fontSize: "12px" }}>Groups</span>
        </div>
        <div
          className="nav-item"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <span style={{ fontSize: "22px" }}>⭐</span>
          <span style={{ fontSize: "12px" }}>Starred</span>
        </div>
        <div
          className="nav-item"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <span style={{ fontSize: "22px" }}>⚙️</span>
          <span style={{ fontSize: "12px" }}>Settings</span>
        </div>
      </div> */}
    </div>
  );
};

export default GroupsList;
