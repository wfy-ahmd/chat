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
<<<<<<< HEAD
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
=======

    const dragMouseDown = (e) => {
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    };

    const elementDrag = (e) => {
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      el.style.top = el.offsetTop - pos2 + "px";
      el.style.left = el.offsetLeft - pos1 + "px";
    };

    const closeDragElement = () => {
      document.onmouseup = null;
      document.onmousemove = null;
>>>>>>> 14fc190b2359fef28e5c86b7a8174c9fd7d9797b
    };

    const header = el.querySelector(`.${styles.FloatingHeader}`);
    if (header) {
<<<<<<< HEAD
      header.addEventListener("mousedown", dragMouseDown);
      header.addEventListener("touchstart", dragMouseDown, { passive: false });
=======
      header.onmousedown = dragMouseDown;
>>>>>>> 14fc190b2359fef28e5c86b7a8174c9fd7d9797b
    }

    return () => {
      if (header) {
<<<<<<< HEAD
        header.removeEventListener("mousedown", dragMouseDown);
        header.removeEventListener("touchstart", dragMouseDown);
      }
      closeDragElement();
=======
        header.onmousedown = null;
      }
      document.onmouseup = null;
      document.onmousemove = null;
>>>>>>> 14fc190b2359fef28e5c86b7a8174c9fd7d9797b
    };
  }, []);

  return (
<<<<<<< HEAD
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
=======
    <div ref={winRef} className={styles.FloatingWindow}>
      <div className={styles.FloatingHeader}>
        <span>{tool}</span>
        <button className={styles.FloatingCloseBtn} onClick={onClose}>
>>>>>>> 14fc190b2359fef28e5c86b7a8174c9fd7d9797b
          ✕
        </button>
      </div>
      <div className={styles.FloatingBody}>{children}</div>
    </div>
  );
}