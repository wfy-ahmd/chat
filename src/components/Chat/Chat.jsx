import { marked } from 'marked';
import DOMPurify from 'dompurify';
import styles from "./Chat.module.css";

const WELCOME_MESSAGE = {
  role: "assistant",
  content: "Hello! I'm LUCA, your AI academic assistant. Ask me anything about Math, Science, Literature, Coding, and more!",
  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

function safeMarkdownParse(text) {
  try {
    return marked.parse(text || '');
  } catch (e) {
    console.warn("Markdown parse error:", e);
    return text;
  }
}

export function Chat({ messages }) {
  const allMessages = [WELCOME_MESSAGE, ...messages];

  return (
    <div className={styles.Chat}>
      {allMessages.map(({ role, content, time }, index) => (
        <div key={index} className={`${styles.Message} ${styles[role]}`}>
          <div className={styles.BubbleWrapper}>
            <div
              className={styles.Bubble}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(safeMarkdownParse(content)),
              }}
            />
            <button
              className={styles.CopyButton}
              onClick={() => navigator.clipboard.writeText(content)}
              title="Copy to clipboard"
            >
              📋
            </button>
            {role === "user" && (
              <button
                className={styles.EditButton}
                onClick={() => alert("Edit feature: Replace this with real logic!")}
                title="Edit message"
              >
                ✏️
              </button>
            )}
          </div>
          <span className={styles.Time}>{time}</span>
        </div>
      ))}
    </div>
  );
}