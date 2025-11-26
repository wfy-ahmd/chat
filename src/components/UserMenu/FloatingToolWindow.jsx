// FloatingToolWindow.jsx
import { useRef, useEffect } from "react";
import styles from "./UserMenu.module.css";

export default function FloatingToolWindow({ tool, children, onClose }) {
  const winRef = useRef(null);

  useEffect(() => {
    const el = winRef.current;
    if (!el) return;

    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    let isDragging = false;

    const dragMouseDown = (e) => {
      // Only start dragging if NOT clicking the close button
      if (e.target.closest(`.${styles.FloatingCloseBtn}`)) {
        return; // Let the close button handle its own click
      }
      
      isDragging = true;
      if (e.cancelable) {
        e.preventDefault();
      }
      
      // Support both mouse and touch events
      const clientX = e.clientX !== undefined ? e.clientX : e.touches?.[0]?.clientX;
      const clientY = e.clientY !== undefined ? e.clientY : e.touches?.[0]?.clientY;
      
      if (clientX === undefined || clientY === undefined) return;
      
      pos3 = clientX;
      pos4 = clientY;
      
      // Convert CSS properties to absolute positioning for dragging
      const rect = el.getBoundingClientRect();
      el.style.position = "fixed";
      el.style.top = rect.top + "px";
      el.style.left = rect.left + "px";
      el.style.right = "auto";
      el.style.bottom = "auto";
      
      if (e.type.includes("touch")) {
        document.addEventListener("touchmove", elementDrag, { passive: false });
        document.addEventListener("touchend", closeDragElement);
      } else {
        document.addEventListener("mousemove", elementDrag);
        document.addEventListener("mouseup", closeDragElement);
      }
    };

    const elementDrag = (e) => {
      if (!isDragging) return;
      
      if (e.cancelable) {
        e.preventDefault();
      }
      
      const clientX = e.clientX !== undefined ? e.clientX : e.touches?.[0]?.clientX;
      const clientY = e.clientY !== undefined ? e.clientY : e.touches?.[0]?.clientY;
      
      if (clientX === undefined || clientY === undefined) return;
      
      pos1 = pos3 - clientX;
      pos2 = pos4 - clientY;
      pos3 = clientX;
      pos4 = clientY;
      
      const newTop = el.offsetTop - pos2;
      const newLeft = el.offsetLeft - pos1;
      
      // Keep within viewport bounds
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const maxTop = Math.max(0, viewportHeight - el.offsetHeight);
      const maxLeft = Math.max(0, viewportWidth - el.offsetWidth);
      
      el.style.top = Math.min(Math.max(0, newTop), maxTop) + "px";
      el.style.left = Math.min(Math.max(0, newLeft), maxLeft) + "px";
    };

    const closeDragElement = () => {
      isDragging = false;
      document.removeEventListener("mousemove", elementDrag);
      document.removeEventListener("mouseup", closeDragElement);
      document.removeEventListener("touchmove", elementDrag);
      document.removeEventListener("touchend", closeDragElement);
    };

    const header = el.querySelector(`.${styles.FloatingHeader}`);
    if (header) {
      header.addEventListener("mousedown", dragMouseDown);
      header.addEventListener("touchstart", dragMouseDown, { passive: false });
    }

    return () => {
      if (header) {
        header.removeEventListener("mousedown", dragMouseDown);
        header.removeEventListener("touchstart", dragMouseDown);
      }
      closeDragElement();
    };
  }, []);

  return (
    <div 
      ref={winRef} 
      className={styles.FloatingWindow}
    >
      <div className={styles.FloatingHeader}>
        <span>{tool}</span>
        <button 
          className={styles.FloatingCloseBtn} 
          onClick={onClose}
          type="button"
        >
          ✕
        </button>
      </div>
      <div className={styles.FloatingBody}>{children}</div>
    </div>
  );
}