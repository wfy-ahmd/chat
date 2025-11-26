// UserMenu.jsx
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useBlur } from "../../contexts/BlurContext";
import { useNavigate } from "react-router-dom";
import FloatingToolWindow from "./FloatingToolWindow";
import styles from "./UserMenu.module.css";

export default function UserMenu({ onClose }) {
  const navigate = useNavigate();

  // State for logout confirmation popup
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [openTools, setOpenTools] = useState([]);

  const [isMenuVisible, setIsMenuVisible] = useState(true);

  // Focus Timer
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [focusSeconds, setFocusSeconds] = useState(0);
  const [isFocusActive, setIsFocusActive] = useState(false);

  // Stopwatch
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);

  // Notes
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  // Settings
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState("general");
  const [settings, setSettings] = useState({
    language: "English",
    region: "Sri Lanka",
    studyMode: "Standard",
    theme: "Dark",
    bubbleStyle: "Glass",
    fontSize: "Medium",
    notifications: true,
    focusAlerts: true,
    noteAlerts: false,
    reduceMotion: false,
    dyslexiaFont: false,
    highContrast: false,
    dataSharing: false,
    cloudSync: true,
    chatStorage: true,
    aiPersonalization: true,
  });

  // Help
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [activeHelpTab, setActiveHelpTab] = useState("help");

  // Focus Timer
  useEffect(() => {
    let interval = null;
    if (isFocusActive) {
      interval = setInterval(() => {
        if (focusSeconds > 0) {
          setFocusSeconds((prev) => prev - 1);
        } else if (focusMinutes > 0) {
          setFocusMinutes((prev) => prev - 1);
          setFocusSeconds(59);
        } else {
          setIsFocusActive(false);
          alert("🎉 Focus session ended!");
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isFocusActive, focusMinutes, focusSeconds]);

  // Stopwatch
  useEffect(() => {
    let interval = null;
    if (isStopwatchRunning) {
      interval = setInterval(() => {
        setStopwatchTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStopwatchRunning]);

  const addNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, { id: Date.now(), text: newNote }]);
      setNewNote("");
    }
  };

  const deleteNote = (id) => setNotes(notes.filter((note) => note.id !== id));

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(
      2,
      "0"
    )}`;

  const openTool = (toolKey) => {
    if (!openTools.includes(toolKey)) {
      setOpenTools((prev) => [...prev, toolKey]);
    }
  };

  const closeTool = (toolKey) => {
    setOpenTools((prev) => prev.filter((t) => t !== toolKey));
  };

  // Handle Logout Confirmation
  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  // sync global blur with logout overlay visibility
  const { setIsBlurred } = useBlur();

  useEffect(() => {
    setIsBlurred(showLogoutConfirm);
    return () => setIsBlurred(false);
  }, [showLogoutConfirm, setIsBlurred]);

  const confirmLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    navigate("/auth");
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <>
      {/* ============================ USER MENU ============================ */}
      {isMenuVisible && (
        <div className={styles.UserMenu}>
          <div className={styles.ToolSectionLabelRow}>
            <div className={styles.ToolSection}>User Menu</div>
            <button
              className={styles.MenuCloseBtn}
              onClick={() => setIsMenuVisible(false)}
            >
              ✕
            </button>
          </div>

          <div
            className={styles.UserMenuItem}
            onClick={() => setIsSettingsOpen(true)}
          >
            ⚙️ Settings
          </div>

          <div
            className={styles.UserMenuItem}
            onClick={() => setIsHelpOpen(true)}
          >
            ❓ Help
          </div>

          <div className={styles.Divider}></div>

          <div className={styles.ToolSection}>Tools</div>

          <div className={styles.UserMenuItem} onClick={() => openTool("focus")}>
            ⏱️ Focus Timer
          </div>
          <div
            className={styles.UserMenuItem}
            onClick={() => openTool("stopwatch")}
          >
            🕒 Stopwatch
          </div>
          <div className={styles.UserMenuItem} onClick={() => openTool("notes")}>
            📝 Notes Saver
          </div>

          <div className={styles.Divider}></div>

          <div
            className={`${styles.UserMenuItem} ${styles.LogoutItem}`}
            onClick={handleLogout} // 👈 Trigger custom popup
          >
            Logout
          </div>
        </div>
      )}

      {/* ============================= FLOATING TOOLS ============================= */}
      {openTools.includes("focus") && (
        <FloatingToolWindow
          tool="Focus Timer"
          onClose={() => closeTool("focus")}
        >
          <div className={styles.TimerDisplay}>
            {String(focusMinutes).padStart(2, "0")}:
            {String(focusSeconds).padStart(2, "0")}
          </div>

          <div className={styles.ToolButtons}>
            <button
              onClick={() => setIsFocusActive(!isFocusActive)}
              className={styles.ToolButton}
            >
              {isFocusActive ? "Pause" : "Start"}
            </button>

            <button
              onClick={() => {
                setIsFocusActive(false);
                setFocusMinutes(25);
                setFocusSeconds(0);
              }}
              className={styles.ToolButton}
            >
              Reset
            </button>
          </div>

          <p className={styles.ToolHint}>Stay focused 🌿</p>
        </FloatingToolWindow>
      )}

      {openTools.includes("stopwatch") && (
        <FloatingToolWindow
          tool="Stopwatch"
          onClose={() => closeTool("stopwatch")}
        >
          <div className={styles.TimerDisplay}>
            {formatTime(stopwatchTime)}
          </div>

          <div className={styles.ToolButtons}>
            <button
              onClick={() => setIsStopwatchRunning(!isStopwatchRunning)}
              className={styles.ToolButton}
            >
              {isStopwatchRunning ? "Stop" : "Start"}
            </button>

            <button
              onClick={() => {
                setIsStopwatchRunning(false);
                setStopwatchTime(0);
              }}
              className={styles.ToolButton}
            >
              Reset
            </button>
          </div>
        </FloatingToolWindow>
      )}

      {openTools.includes("notes") && (
        <FloatingToolWindow tool="Notes Saver" onClose={() => closeTool("notes")}>
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Write your note..."
            className={styles.ToolTextarea}
          />

          <button onClick={addNote} className={styles.ToolButton}>
            Add Note
          </button>

          <div className={styles.NotesList}>
            {notes.map((note) => (
              <div key={note.id} className={styles.NoteItem}>
                <span>{note.text}</span>
                <button
                  onClick={() => deleteNote(note.id)}
                  className={styles.DeleteButton}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          {notes.length === 0 && <p className={styles.ToolHint}>No notes yet</p>}
        </FloatingToolWindow>
      )}

      {/* ============================= SETTINGS MODAL ============================= */}
      {isSettingsOpen && (
        <div
          className={styles.SettingsOverlay}
          onClick={() => setIsSettingsOpen(false)}
        >
          <div
            className={styles.SettingsModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.SettingsHeader}>
              <div>
                <h3>Settings</h3>
                <p>Customize your study experience</p>
              </div>

              <button
                className={styles.SettingsCloseBtn}
                onClick={() => setIsSettingsOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className={styles.SettingsBody}>
              <div className={styles.SettingsSidebar}>
                {[
                  ["general", "General"],
                  ["appearance", "Appearance"],
                  ["notifications", "Notifications"],
                  ["accessibility", "Accessibility"],
                  ["privacy", "Privacy"],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    className={`${styles.SettingsTab} ${
                      activeSettingsTab === key ? styles.SettingsTabActive : ""
                    }`}
                    onClick={() => setActiveSettingsTab(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* ========================= TAB CONTENT ========================= */}
              <div className={styles.SettingsContent}>
                
                {/* ----------------------------- GENERAL ----------------------------- */}
                {activeSettingsTab === "general" && (
                  <>
                    <h4>General</h4>

                    {/* Language */}
                    <div className={styles.SettingRow}>
                      <div className={styles.SettingText}>
                        <span>Language</span>
                        <small>
                          Choose your preferred language for the LUCA interface
                        </small>
                      </div>
                      <select
                        className={styles.SettingSelect}
                        value={settings.language}
                        onChange={(e) =>
                          setSettings({ ...settings, language: e.target.value })
                        }
                      >
                        <option>English</option>
                        <option>Tamil</option>
                        <option>Sinhala</option>
                      </select>
                    </div>

                    {/* Region */}
                    <div className={styles.SettingRow}>
                      <div className={styles.SettingText}>
                        <span>Region</span>
                        <small>Content and examples will match your region</small>
                      </div>
                      <select
                        className={styles.SettingSelect}
                        value={settings.region}
                        onChange={(e) =>
                          setSettings({ ...settings, region: e.target.value })
                        }
                      >
                        <option>Sri Lanka</option>
                        <option>India</option>
                        <option>UK</option>
                        <option>USA</option>
                      </select>
                    </div>

                    {/* Study Mode */}
                    <div className={styles.SettingRow}>
                      <div className={styles.SettingText}>
                        <span>Study Mode</span>
                        <small>Choose how LUCA assists your learning</small>
                      </div>

                      <select
                        className={styles.SettingSelect}
                        value={settings.studyMode}
                        onChange={(e) =>
                          setSettings({ ...settings, studyMode: e.target.value })
                        }
                      >
                        <option>Standard Guidance</option>
                        <option>Exam Focused</option>
                        <option>Assignment Helper</option>
                        <option>Concept Understanding</option>
                      </select>
                    </div>
                  </>
                )}

                {/* ----------------------------- APPEARANCE ----------------------------- */}
                {activeSettingsTab === "appearance" && (
                  <>
                    <h4>Appearance</h4>

                    {/* Theme */}
                    <div className={styles.SettingRow}>
                      <div className={styles.SettingText}>
                        <span>Theme</span>
                        <small>Switch between light, dark or AMOLED mode</small>
                      </div>
                      <select
                        className={styles.SettingSelect}
                        value={settings.theme}
                        onChange={(e) =>
                          setSettings({ ...settings, theme: e.target.value })
                        }
                      >
                        <option>Dark</option>
                        <option>Light</option>
                        <option>AMOLED Black</option>
                      </select>
                    </div>

                    {/* Chat Bubble Style */}
                    <div className={styles.SettingRow}>
                      <div className={styles.SettingText}>
                        <span>Chat Bubble Style</span>
                        <small>Choose the design of your chat messages</small>
                      </div>
                      <select
                        className={styles.SettingSelect}
                        value={settings.bubbleStyle}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            bubbleStyle: e.target.value,
                          })
                        }
                      >
                        <option>Glass Neon</option>
                        <option>Minimal Rounded</option>
                        <option>Classic</option>
                      </select>
                    </div>

                    {/* Font Size */}
                    <div className={styles.SettingRow}>
                      <div className={styles.SettingText}>
                        <span>Font Size</span>
                        <small>Adjust readability for long sessions</small>
                      </div>
                      <select
                        className={styles.SettingSelect}
                        value={settings.fontSize}
                        onChange={(e) =>
                          setSettings({ ...settings, fontSize: e.target.value })
                        }
                      >
                        <option>Small</option>
                        <option>Medium</option>
                        <option>Large</option>
                      </select>
                    </div>
                  </>
                )}

                {/* --------------------------- NOTIFICATIONS --------------------------- */}
                {activeSettingsTab === "notifications" && (
                  <>
                    <h4>Notifications</h4>

                    {/* Study Reminders */}
                    <div className={styles.SettingRow}>
                      <div className={styles.SettingText}>
                        <span>Study Reminders</span>
                        <small>
                          Receive gentle nudges to <br></br>stay consistent with learning
                        </small>
                      </div>

                      <label className={styles.ToggleWrapper}>
                        <input
                          type="checkbox"
                          checked={settings.notifications}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              notifications: e.target.checked,
                            })
                          }
                        />
                        <span className={styles.ToggleSlider}></span>
                      </label>
                    </div>

                    {/* Focus Alerts */}
                    <div className={styles.SettingRow}>
                      <div className={styles.SettingText}>
                        <span>Focus Timer Alerts</span>
                        <small>
                          Receive alerts when your Focus Timer ends
                        </small>
                      </div>

                      <label className={styles.ToggleWrapper}>
                        <input
                          type="checkbox"
                          checked={settings.focusAlerts}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              focusAlerts: e.target.checked,
                            })
                          }
                        />
                        <span className={styles.ToggleSlider}></span>
                      </label>
                    </div>

                    {/* Note Alerts */}
                    <div className={styles.SettingRow}>
                      <div className={styles.SettingText}>
                        <span>Note Alerts</span>
                        <small>
                          Get reminders if you forget<br></br> to save important notes
                        </small>
                      </div>

                      <label className={styles.ToggleWrapper}>
                        <input
                          type="checkbox"
                          checked={settings.noteAlerts}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              noteAlerts: e.target.checked,
                            })
                          }
                        />
                        <span className={styles.ToggleSlider}></span>
                      </label>
                    </div>
                  </>
                )}

                {/* --------------------------- ACCESSIBILITY --------------------------- */}
                {activeSettingsTab === "accessibility" && (
                  <>
                    <h4>Accessibility</h4>

                    {/* Dyslexia Font */}
                    <div className={styles.SettingRow}>
                      <div className={styles.SettingText}>
                        <span>Dyslexia-Friendly Font</span>
                        <small>Improves readability for dyslexic learners</small>
                      </div>
                      <label className={styles.ToggleWrapper}>
                        <input
                          type="checkbox"
                          checked={settings.dyslexiaFont}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              dyslexiaFont: e.target.checked,
                            })
                          }
                        />
                        <span className={styles.ToggleSlider}></span>
                      </label>
                    </div>

                    {/* High Contrast */}
                    <div className={styles.SettingRow}>
                      <div className={styles.SettingText}>
                        <span>High Contrast Mode</span>
                        <small>
                          Improve visibility with sharper contrast colors
                        </small>
                      </div>
                      <label className={styles.ToggleWrapper}>
                        <input
                          type="checkbox"
                          checked={settings.highContrast}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              highContrast: e.target.checked,
                            })
                          }
                        />
                        <span className={styles.ToggleSlider}></span>
                      </label>
                    </div>

                    {/* Reduce Motion */}
                    <div className={styles.SettingRow}>
                      <div className={styles.SettingText}>
                        <span>Reduce Animations</span>
                        <small>Removes visual motion for sensitive users</small>
                      </div>
                      <label className={styles.ToggleWrapper}>
                        <input
                          type="checkbox"
                          checked={settings.reduceMotion}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              reduceMotion: e.target.checked,
                            })
                          }
                        />
                        <span className={styles.ToggleSlider}></span>
                      </label>
                    </div>
                  </>
                )}

                {/* ------------------------------- PRIVACY ------------------------------- */}
                {activeSettingsTab === "privacy" && (
                  <>
                    <h4>Privacy</h4>

                    {/* Cloud Sync */}
                    <div className={styles.SettingRow}>
                      <div className={styles.SettingText}>
                        <span>Cloud Sync</span>
                        <small>Sync chats and notes across your devices</small>
                      </div>
                      <label className={styles.ToggleWrapper}>
                        <input
                          type="checkbox"
                          checked={settings.cloudSync}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              cloudSync: e.target.checked,
                            })
                          }
                        />
                        <span className={styles.ToggleSlider}></span>
                      </label>
                    </div>

                    {/* Chat Storage */}
                    <div className={styles.SettingRow}>
                      <div className={styles.SettingText}>
                        <span>Chat Storage</span>
                        <small>Store your previous chats securely</small>
                      </div>
                      <label className={styles.ToggleWrapper}>
                        <input
                          type="checkbox"
                          checked={settings.chatStorage}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              chatStorage: e.target.checked,
                            })
                          }
                        />
                        <span className={styles.ToggleSlider}></span>
                      </label>
                    </div>

                    {/* AI Personalization */}
                    <div className={styles.SettingRow}>
                      <div className={styles.SettingText}>
                        <span>AI Personalization</span>
                        <small>
                          Personalize responses based on <br></br>
                          your study habits
                        </small>
                      </div>
                      <label className={styles.ToggleWrapper}>
                        <input
                          type="checkbox"
                          checked={settings.aiPersonalization}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              aiPersonalization: e.target.checked,
                            })
                          }
                        />
                        <span className={styles.ToggleSlider}></span>
                      </label>
                    </div>

                    {/* Data Sharing */}
                    <div className={styles.SettingRow}>
                      <div className={styles.SettingText}>
                        <span>Analytics & Data Sharing</span>
                        <small>
                          Share anonymous usage data to improve LUCA
                        </small>
                      </div>
                      <label className={styles.ToggleWrapper}>
                        <input
                          type="checkbox"
                          checked={settings.dataSharing}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              dataSharing: e.target.checked,
                            })
                          }
                        />
                        <span className={styles.ToggleSlider}></span>
                      </label>
                    </div>

                    <button className={styles.DangerButton}>
                      Delete All Chat History
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------- HELP CENTER ----------------------------- */}
      {isHelpOpen && (
        <div
          className={styles.HelpOverlay}
          onClick={() => setIsHelpOpen(false)}
        >
          <div
            className={styles.HelpModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.HelpHeader}>
              <div>
                <h3>Help Center</h3>
                <p>Your guide to using LUCA</p>
              </div>

              <button
                className={styles.HelpCloseBtn}
                onClick={() => setIsHelpOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className={styles.HelpBody}>
              <div className={styles.HelpSidebar}>
                {[
                  ["help", "Help Center"],
                  ["terms", "Terms & Policies"],
                  ["bug", "Report a Bug"],
                  ["download", "Download Apps"],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    className={`${styles.HelpTab} ${
                      activeHelpTab === key ? styles.HelpTabActive : ""
                    }`}
                    onClick={() => setActiveHelpTab(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className={styles.HelpContent}>
                {activeHelpTab === "help" && (
                  <>
                    <h4>Welcome to LUCA</h4>
                    <p className={styles.HelpParagraph}>
                      <strong>Stop stressing. Start understanding.</strong>
                      <br />
                      LUCA simplifies every concept so you learn faster and
                      retain better.
                    </p>

                    <h4>Study Tools</h4>
                    <ul className={styles.HelpList}>
                      <li>📚 Ask anything — subjects, concepts, coding </li>
                      <li>💬 Save your chats like a study notebook</li>
                      <li>⏰ Built-in Pomodoro focus timer</li>
                      <li>📝 Write and save unlimited notes</li>
                    </ul>

                    <h4>Why LUCA?</h4>
                    <p className={styles.HelpParagraph}>
                      LUCA adapts to your learning style, supports multiple
                      languages, and helps you stay confident during exams.
                    </p>
                  </>
                )}

                {activeHelpTab === "terms" && (
                  <>
                    <h4>Terms & Policies</h4>
                    <p className={styles.HelpParagraph}>
                      By using LUCA, you agree to our <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>.
                    </p>
                    <p className={styles.HelpParagraph}>
                      We are committed to protecting your data. LUCA only stores what is necessary to provide and improve your learning experience.
                    </p>
                    <p className={styles.HelpParagraph}>
                      You retain full ownership of your notes and chats. You can delete your data at any time from the Privacy section in Settings.
                    </p>
                    <p className={styles.HelpParagraph}>
                      LUCA complies with global data protection standards and never sells your information to third parties.
                    </p>
                  </>
                )}

                {activeHelpTab === "bug" && (
                  <>
                    <h4>Report a Bug</h4>
                    <p className={styles.HelpParagraph}>
                      Found something not working as expected? We’d love your help to make LUCA better!
                    </p>
                    <textarea
                      className={styles.HelpTextarea}
                      placeholder="Describe the issue (e.g., 'Focus timer doesn't pause', 'Notes disappear after refresh', etc.)..."
                    ></textarea>
                    <button className={styles.HelpSubmitBtn}>
                      Submit Report
                    </button>
                    <p className={styles.HelpParagraph} style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: '#aaa' }}>
                      📌 Tip: Include your device type and browser for faster resolution.
                    </p>
                  </>
                )}

                {activeHelpTab === "download" && (
                  <>
                    <h4>Download LUCA</h4>
                    <p className={styles.HelpParagraph}>
                      Use LUCA anywhere — on your phone, tablet, or desktop.
                    </p>
                    <div className={styles.DownloadButtons}>
                      <button className={styles.StoreButton}>📱 Android App</button>
                      <button className={styles.StoreButton}>📲 iOS App</button>
                      <button className={styles.StoreButton}>🖥️ Desktop App</button>
                    </div>
                    <p className={styles.HelpParagraph} style={{ marginTop: '1rem' }}>
                      All apps sync seamlessly with your account so you never lose progress.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================= CUSTOM LOGOUT CONFIRMATION POPUP ============================= */}
      {showLogoutConfirm &&
        createPortal(
          <div className={styles.LogoutConfirmOverlay}>
            <div className={styles.LogoutConfirmModal}>
              <img src="/images/logout_1.png" className={styles.LogoutConfirmImage} />
              <h3>Are you logging out?</h3>

              <div className={styles.LogoutConfirmButtons}>
                <button
                  className={styles.LogoutConfirmCancel}
                  onClick={cancelLogout}
                >
                  Cancel
                </button>
                <button
                  className={styles.LogoutConfirmConfirm}
                  onClick={confirmLogout}
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
