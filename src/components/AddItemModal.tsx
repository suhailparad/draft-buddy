import { useState } from "react";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (text: string) => void;
}

const ITEM_TYPES = [
  { id: "text", title: "Text Note", description: "Just write your thoughts", icon: "\u{1F4DD}", color: "#e8f5e9" },
  { id: "checklist", title: "Checklist", description: "Create a checklist", icon: "\u{2705}", color: "#e3f2fd" },
  { id: "link", title: "Link", description: "Save a link with preview", icon: "\u{1F517}", color: "#f3e5f5" },
  { id: "image", title: "Image", description: "Save an image", icon: "\u{1F5BC}\uFE0F", color: "#fff3e0" },
  { id: "voice", title: "Voice Note", description: "Record a voice note", icon: "\u{1F399}\uFE0F", color: "#fce4ec" },
  { id: "document", title: "Document", description: "Save a document", icon: "\u{1F4C4}", color: "#f5f5f5" },
];

const AddItemModal = ({ isOpen, onClose, onAddItem }: AddItemModalProps) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [textInput, setTextInput] = useState("");
  const [checklistItems, setChecklistItems] = useState<string[]>([""]);

  if (!isOpen) return null;

  const handleAdd = () => {
    if (selectedType === "text" || selectedType === "link") {
      if (textInput.trim()) { onAddItem(textInput.trim()); setTextInput(""); setSelectedType(null); onClose(); }
    } else if (selectedType === "checklist") {
      const validItems = checklistItems.filter((item) => item.trim());
      if (validItems.length > 0) {
        const checklistText = validItems.map((item) => "\u2610 " + item).join("\n");
        onAddItem(checklistText); setChecklistItems([""]); setSelectedType(null); onClose();
      }
    } else {
      onAddItem("[" + (ITEM_TYPES.find((t) => t.id === selectedType)?.title || "") + "]");
      setSelectedType(null); onClose();
    }
  };

  return (
    <div className="bottom-sheet-overlay" onClick={onClose}>
      <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="bottom-sheet-handle" />
        {!selectedType ? (
          <>
            <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px", padding: "0 8px" }}>Add New Item</h3>
            {ITEM_TYPES.map((type) => (
              <div key={type.id} className="bottom-sheet-item" onClick={() => setSelectedType(type.id)}>
                <div className="bottom-sheet-icon" style={{ background: type.color }}>{type.icon}</div>
                <div className="bottom-sheet-item-text"><h4>{type.title}</h4><p>{type.description}</p></div>
              </div>
            ))}
          </>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <button onClick={() => { setSelectedType(null); setTextInput(""); setChecklistItems([""]); }} style={{ background: "transparent", border: "none", cursor: "pointer", padding: "4px", display: "flex", alignItems: "center", color: "var(--text-primary)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
              </button>
              <h3 style={{ fontSize: "18px", fontWeight: 600 }}>{ITEM_TYPES.find((t) => t.id === selectedType)?.title}</h3>
            </div>
            {selectedType === "text" && <textarea value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder="Write something..." autoFocus style={{ width: "100%", minHeight: "120px", padding: "14px 16px", border: "1px solid var(--border-color)", borderRadius: "12px", fontSize: "15px", outline: "none", resize: "vertical", lineHeight: 1.5 }} />}
            {selectedType === "link" && <input type="url" value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder="Paste a link..." autoFocus style={{ width: "100%", padding: "14px 16px", border: "1px solid var(--border-color)", borderRadius: "12px", fontSize: "15px", outline: "none" }} />}
            {selectedType === "checklist" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {checklistItems.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "22px", height: "22px", border: "2px solid #ccc", borderRadius: "4px", flexShrink: 0 }} />
                    <input type="text" value={item} onChange={(e) => { const updated = [...checklistItems]; updated[idx] = e.target.value; setChecklistItems(updated); }} placeholder={"Item " + (idx + 1)} style={{ flex: 1, padding: "10px 14px", border: "1px solid var(--border-color)", borderRadius: "10px", fontSize: "15px", outline: "none" }} />
                  </div>
                ))}
                <button onClick={() => setChecklistItems([...checklistItems, ""])} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", background: "transparent", border: "1px dashed var(--border-color)", borderRadius: "10px", cursor: "pointer", fontSize: "14px", color: "var(--primary-green)", fontWeight: 500 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg> Add item
                </button>
              </div>
            )}
            {selectedType === "image" && <div style={{ border: "2px dashed var(--border-color)", borderRadius: "12px", padding: "40px 20px", textAlign: "center", cursor: "pointer" }}><div style={{ fontSize: "40px", marginBottom: "12px" }}>\u{1F5BC}\uFE0F</div><p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Tap to select an image</p></div>}
            {selectedType === "voice" && <div style={{ textAlign: "center", padding: "30px 0" }}><button style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#fce4ec", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "32px", marginBottom: "16px" }}>\u{1F399}\uFE0F</button><p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Tap to start recording</p></div>}
            {selectedType === "document" && <div style={{ border: "2px dashed var(--border-color)", borderRadius: "12px", padding: "40px 20px", textAlign: "center", cursor: "pointer" }}><div style={{ fontSize: "40px", marginBottom: "12px" }}>\u{1F4C4}</div><p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Tap to select a document</p></div>}
            <button onClick={handleAdd} disabled={(selectedType === "text" && !textInput.trim()) || (selectedType === "link" && !textInput.trim()) || (selectedType === "checklist" && checklistItems.every((item) => !item.trim()))} style={{ width: "100%", padding: "14px", backgroundColor: "var(--primary-green)", color: "#fff", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: 600, cursor: "pointer", marginTop: "20px", opacity: ((selectedType === "text" && textInput.trim()) || (selectedType === "link" && textInput.trim()) || (selectedType === "checklist" && checklistItems.some((item) => item.trim())) || selectedType === "image" || selectedType === "voice" || selectedType === "document") ? 1 : 0.5 }}>Add</button>
          </>
        )}
      </div>
    </div>
  );
};

export default AddItemModal;