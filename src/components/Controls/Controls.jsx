import { useState, useRef } from "react";
import styles from "./Controls.module.css";

export default function Controls({ onSend, onFileUpload }) {
  const [content, setContent] = useState("");
  const fileInputRef = useRef(null);

  function handleContentChange(event) {
    setContent(event.target.value);
  }

  function handleContentSend() {
    if (content.trim().length > 0) {
      onSend(content);
      setContent("");
    }
  }

  function handleEnterPress(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleContentSend();
    }
  }

  function handleFileClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file && (file.type === "application/pdf" || file.name.endsWith(".doc") || file.name.endsWith(".docx"))) {
      onFileUpload(file);
      e.target.value = "";
    } else {
      alert("Please upload a PDF or DOC file.");
    }
  }

  return (
    <div className={styles.Controls}>
      <textarea
        className={styles.TextArea}
        placeholder="Ask LUCA anything... Math, Science, History, Coding?"
        value={content}
        onChange={handleContentChange}
        onKeyDown={handleEnterPress}
      />
      <div className={styles.ButtonGroup}>
        <button className={styles.IconButton} onClick={handleFileClick} title="Upload PDF/DOC">
          📎
        </button>
        <button className={styles.SendButton} onClick={handleContentSend} disabled={!content.trim()}>
          <SendIcon />
        </button>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx"
        style={{ display: 'none' }}
      />
    </div>
  );
}

function SendIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="26px"
      viewBox="0 -960 960 960"
      width="26px"
      fill="#fff"
    >
      <path d="M120-160v-240l320-80-320-80v-240l760 320-760 320Z" />
    </svg>
  );
}