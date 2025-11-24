import { useState, useEffect, useRef } from "react";
import { Assistant } from "./assistants/googleai";
import { Chat } from "./components/Chat/Chat";
import Controls from "./components/Controls/Controls";
import Background from "./components/Background/Background";
import Features from "./components/Features/Features";
import Sidebar from "./components/Sidebar/Sidebar";
import UserMenu from "./components/UserMenu/UserMenu";
import styles from "./App.module.css";
import { useBlur } from "./contexts/BlurContext";

function App() {
  const assistant = useRef(new Assistant()).current;
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const chatEndRef = useRef(null);
  const { isBlurred } = useBlur();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function addMessage(message) {
    setMessages((prevMessages) => [...prevMessages, message]);
  }

  async function handleContentSend(content) {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage = { content, role: "user", time: timestamp };
    addMessage(userMessage);
    setIsTyping(true);

    try {
      const result = await assistant.chat([...messages, userMessage]);
      const responseTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setIsTyping(false);
      addMessage({ content: result, role: "assistant", time: responseTime });
    } catch {
      setIsTyping(false);
      addMessage({
        content: "Sorry, I couldn't process your request. Please try again!",
        role: "assistant",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    }
  }

  function handleSubjectSelect(prompt) {
    handleContentSend(prompt);
  }

  async function handleFileUpload(file) {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    addMessage({ content: `📄 Uploaded: ${file.name}`, role: "user", time: timestamp });
    setIsTyping(true);
    try {
      const result = "File received! Ask me anything about it.";
      const responseTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setIsTyping(false);
      addMessage({ content: result, role: "assistant", time: responseTime });
    } catch {
      setIsTyping(false);
      addMessage({
        content: "Couldn't process the file. Try again.",
        role: "assistant",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    }
  }

  function handleNewChat() {
    setMessages([]);
  }

  return (
    <>
      <Background />
      <div className={styles.App}>
        {/* LEFT SIDEBAR */}
        <Sidebar onNewChat={handleNewChat} />

        {/* CENTERED CHAT AREA */}
        <div className={`${styles.ChatContainer} ${isBlurred ? styles.Blurred : ""}`}>
          <header className={styles.Header}>
            <img className={styles.Logo} src="/robot-Luca.svg" alt="LUCA Bot" />
            <h5 className={styles.Title}>LUCA</h5>
          </header>

          <Features onSubjectSelect={handleSubjectSelect} />

          <div className={styles.ChatBody}>
            <Chat messages={messages} />
            {isTyping && (
              <div className={styles.TypingIndicator}>
                <div className={styles.Dot}></div>
                <div className={styles.Dot}></div>
                <div className={styles.Dot}></div>
                <span>LUCA is thinking...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <Controls onSend={handleContentSend} onFileUpload={handleFileUpload} />
        </div>

        {/* RIGHT SIDEBAR */}
        <div className={`${styles.RightSidebar} ${isBlurred ? styles.Blurred : ""}`}>
          <button
            className={styles.UserAvatar}
            onClick={() => setShowUserMenu(!showUserMenu)}
            title="Open user menu"
          >
            W
          </button>
          {showUserMenu && <UserMenu onClose={() => setShowUserMenu(false)} />}
        </div>
      </div>
    </>
  );
}

export default App;