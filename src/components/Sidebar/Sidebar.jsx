import { useState, useEffect } from "react";
import { useBlur } from "../../contexts/BlurContext";
import styles from "./Sidebar.module.css";

export default function Sidebar({ onNewChat, isOpen: initialOpen = true }) {
  // -----------------------------
  // 🗂 Chat History (localStorage)
  // -----------------------------
  const [chats, setChats] = useState(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("chatHistory");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("chatHistory", JSON.stringify(chats));
  }, [chats]);

  const addChat = () => {
    const newChat = {
      id: Date.now(),
      title: `New Chat ${chats.length + 1}`,
      date: new Date().toISOString(),
    };
    setChats((prev) => [newChat, ...prev]);
    onNewChat?.();
  };

  // -----------------------------
  // 🔍 Real-time Search
  // -----------------------------
  const [searchTerm, setSearchTerm] = useState("");

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // -----------------------------
  // ✏️ Rename + 🗑 Delete Chat
  // -----------------------------
  const [editingChatId, setEditingChatId] = useState(null);
  const [editingChatTitle, setEditingChatTitle] = useState("");

  const startEditingChat = (chat) => {
    setEditingChatId(chat.id);
    setEditingChatTitle(chat.title);
  };

  const saveEditingChat = () => {
    if (!editingChatTitle.trim()) return;
    setChats((prev) =>
      prev.map((c) =>
        c.id === editingChatId ? { ...c, title: editingChatTitle.trim() } : c
      )
    );
    setEditingChatId(null);
    setEditingChatTitle("");
  };

  const cancelEditingChat = () => {
    setEditingChatId(null);
    setEditingChatTitle("");
  };

  const deleteChat = (id) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
  };

  // -----------------------------
  // 🕒 Date Formatting + Grouping
  // -----------------------------
  const formatDate = (iso) => {
    const date = new Date(iso);
    const today = new Date();

    const isToday = date.toDateString() === today.toDateString();

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const groupedChats = filteredChats.reduce((acc, chat) => {
    const formatted = formatDate(chat.date);
    if (!acc[formatted]) acc[formatted] = [];
    acc[formatted].push(chat);
    return acc;
  }, {});

  // -----------------------------
  // 🔖 Saved Sessions (static)
  // -----------------------------
  const savedSessions = [
   
  { id: 101, title: "Algebra Revision Sheet" },
  { id: 102, title: "Biology Exam Notes" },
  { id: 103, title: "Essay: Climate Change" },
  { id: 104, title: "Physics Formula Summary" },
  { id: 105, title: "Python Programming Notes" },
  { id: 106, title: "Chemistry Organic Reactions" },
  { id: 107, title: "English Literature: Hamlet Analysis" },
  { id: 108, title: "Computer Science – OOP Basics" },
  { id: 109, title: "Business Studies – Marketing Mix" },
  { id: 110, title: "Geography: Volcano Case Study" }
  ];

  // -----------------------------
  // ⚙️ CLEAR Modal
  // -----------------------------
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const resetChats = () => setChats([]);
  const clearAllData = () => {
    if (typeof window === "undefined") return;
    localStorage.clear();
    setChats([]);
  };

  // -----------------------------
  // ⏹ Expand/Collapse Sections
  // -----------------------------
  const [expanded, setExpanded] = useState({
    history: true,
    saved: true,
  });

  const toggle = (section) => {
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // -----------------------------
  // 📱 Mobile Sidebar Open/Close
  // -----------------------------
  const [isOpen, setIsOpen] = useState(initialOpen);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // -----------------------------
  // JSX
  // -----------------------------
  const { isBlurred } = useBlur();

  return (
    <>
      {/* Hamburger Button */}
      <button
        className={`${styles.MenuButton} ${isOpen ? styles.hidden : ""}`}
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
      >
        <div className={styles.HamburgerIcon}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      {/* Sidebar */}
      <div
        className={`${styles.Sidebar} ${isOpen ? styles.open : ""} ${styles.SidebarDark} ${isBlurred ? styles.Blurred : ""}`}
      >
        {/* Close Button */}
        <button
          className={styles.CloseButton}
          onClick={() => setIsOpen(false)}
          aria-label="Close menu"
        >
          ‹
        </button>

        <div className={styles.SidebarScrollable}>
          {/* New Chat Button */}
          <div className={styles.SidebarHeader}>
            <button className={styles.NewChatButton} onClick={addChat}>
              + New Chat
            </button>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search"
            className={styles.SearchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* History */}
          <div className={styles.NavSection}>
            <button
              className={styles.SectionHeader}
              onClick={() => toggle("history")}
              aria-expanded={expanded.history}
            >
              <span>💬 History</span>
              <span>{expanded.history ? "▲" : "▼"}</span>
            </button>

            {expanded.history && (
              <div className={styles.SectionContent}>
                <div className={styles.ChatListSection}>All chats</div>

                {Object.keys(groupedChats).length === 0 && (
                  <div className={styles.EmptyText}>
                    No chats yet. Start one with <strong>+ New Chat</strong>.
                  </div>
                )}

                {Object.keys(groupedChats).map((date) => (
                  <div key={date}>
                    <div className={styles.ChatListSection}>{date}</div>
                    {groupedChats[date].map((chat) => (
                      <div key={chat.id} className={styles.ChatItem}>
                        {editingChatId === chat.id ? (
                          <div className={styles.ChatItemInner}>
                            <input
                              className={styles.ChatTitleInput}
                              value={editingChatTitle}
                              onChange={(e) =>
                                setEditingChatTitle(e.target.value)
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveEditingChat();
                                if (e.key === "Escape") cancelEditingChat();
                              }}
                              autoFocus
                            />
                            <div className={styles.ChatActions}>
                              <button
                                className={styles.IconButton}
                                onClick={saveEditingChat}
                                title="Save"
                              >
                                ✔
                              </button>
                              <button
                                className={styles.IconButton}
                                onClick={cancelEditingChat}
                                title="Cancel"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className={styles.ChatItemInner}>
                            <div className={styles.ChatTitle}>{chat.title}</div>
                            <div className={styles.ChatActions}>
                              <button
                                className={styles.IconButton}
                                onClick={() => startEditingChat(chat)}
                                title="Rename chat"
                              >
                                ✏️
                              </button>
                              <button
                                className={styles.IconButton}
                                onClick={() => deleteChat(chat.id)}
                                title="Delete chat"
                              >
                                🗑
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saved Sessions */}
          <div className={styles.NavSection}>
            <button
              className={styles.SectionHeader}
              onClick={() => toggle("saved")}
              aria-expanded={expanded.saved}
            >
              <span>🔖 Saved Sessions</span>
              <span>{expanded.saved ? "▲" : "▼"}</span>
            </button>
            {expanded.saved && (
              <div className={styles.SectionContent}>
                {savedSessions.map((s) => (
                  <div key={s.id} className={styles.ChatItem}>
                    {s.title}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CLEAR Modal Trigger */}
          <div
            className={styles.NavItem}
            onClick={() => setIsSettingsOpen(true)}
          >
             CLEAR
          </div>
        </div>

        {/* Footer */}
        <div className={styles.UserFooter}>
          <div className={styles.UserAvatar}>W</div>
          <span>Wafry Ahamed</span>
        </div>
      </div>

      {/* clear Modal */}
      {isSettingsOpen && (
        <div className={styles.ModalOverlay}>
          <div className={styles.Modal}>
            <div className={styles.ModalHeader}>
              <h2 className={styles.ModalTitle}>Clear</h2>
              <button
                className={styles.ModalClose}
                onClick={() => setIsSettingsOpen(false)}
                aria-label="Close settings"
              >
                ✕
              </button>
            </div>

            {/* Data controls */}
            <div className={styles.ModalSection}>
              <h3>Data</h3>
              <div className={styles.ButtonRow}>
                <button className={styles.SecondaryButton} onClick={resetChats}>
                  Reset chats
                </button>
              </div>
              <button className={styles.DangerButton} onClick={clearAllData}>
                Clear all app data
              </button>
              <p className={styles.HelperText}>
                This will remove chats, notes and settings stored on this device.
              </p>
            </div>

            {/* About */}
            <div className={styles.ModalSection}>
              <h3>About</h3>
              <p className={styles.HelperText}>LUCA Study Assistant · v1.0.0</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}