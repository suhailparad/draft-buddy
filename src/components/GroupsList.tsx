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

  const avatarGradients = [
    "from-emerald-500 to-emerald-700",
    "from-blue-500 to-blue-700",
    "from-purple-500 to-purple-700",
    "from-pink-500 to-rose-600",
    "from-orange-400 to-orange-600",
    "from-cyan-500 to-sky-600",
    "from-indigo-500 to-violet-700",
    "from-red-500 to-red-700",
    "from-yellow-400 to-amber-600",
    "from-teal-500 to-teal-700",
  ];

  const getAvatarGradient = (id: string) => {
    let hash = 0;

    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }

    return avatarGradients[Math.abs(hash) % avatarGradients.length];
  };

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
      <header className="px-6 pt-6 pb-5">
        <div className="flex items-center justify-between">

            <h1 className="text-2xl font-black">
                <span className="text-emerald-600">Draft</span>
                <span className="ml-0.5">Buddy</span>
            </h1>
            <button
                onClick={() => navigate("/profile")}
                className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-100 transition"
            >
                <span className="material-symbols-outlined text-slate-500">
                    more_horiz
                </span>
            </button>

        </div>
      </header>

      {/* Search Bar */}
      <div className="px-6 mb-4">
          <div className="flex items-center rounded-full bg-slate-100 px-5 h-12">
              <span className="material-symbols-outlined text-slate-400">
                  search
              </span>
              <input
                  placeholder="Search spaces..."
                  value={searchQuery}
                  onChange={(e)=>setSearchQuery(e.target.value)}
                  className="ml-3 bg-transparent flex-1 outline-none text-[16px]"
              />
          </div>
      </div>

      <div className="flex justify-between items-center px-6 mb-1">
          <h2 className="font-semibold text-[14px] text-gray-500">
              Your Spaces
          </h2>

          {/* <button className="text-sm text-slate-500 flex items-center gap-1">
              Recently updated
              <span className="material-symbols-outlined text-lg">
                  keyboard_arrow_down
              </span>
          </button> */}

      </div>

      {/* Groups List */}
      <div
        style={{
          flex: "1",
          overflowY: "auto",
          paddingBottom: "80px", // Space for bottom nav
        }}
      >
        {filteredGroups.map((group, index) => (
          <Link
              to={`/chat/${group.id}`}
              state={{ groupName: group.name }}
              className="group flex items-center px-6 py-3 hover:bg-slate-100 active:bg-slate-100 transition"
          >
              <div
                className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarGradient(
                  group.id
                )} text-white flex items-center justify-center font-bold text-xl shrink-0`}
              >
                {group.name.charAt(0).toUpperCase()}
              </div>

              {/* Title */}
              <div className={`ml-4 flex-1 min-w-0 border-b border-slate-200 pb-2.5 ${
                  index !== filteredGroups.length - 1
                    ? "border-b border-slate-200"
                    : ""
                } `}>
                  <div className="flex justify-between">
                      <h3 className="font-bold text-[15px] truncate">
                          {group.name}
                      </h3>
                      <span className="text-sm text-slate-400">
                          {new Intl.DateTimeFormat('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          }).format(group.createdAt)}
                      </span>

                  </div>

                  <p className="text-slate-500 truncate mt-1">

                      {group.itemCount
                          ? `${group.itemCount} notes`
                          : "Empty space"}

                  </p>

              </div>

          </Link>
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
