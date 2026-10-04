import { useEffect, useRef } from "react";
export default function Dialog({ title, onClose, children }) {
  const ref = useRef(null),
    closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);
  useEffect(() => {
    const previous = document.activeElement;
    const el = ref.current;
    el?.focus();
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handler = (event) => {
      if (event.key === "Escape") closeRef.current();
      if (event.key === "Tab") {
        const nodes = [
          ...el.querySelectorAll(
            'button:not([disabled]),a[href],input:not([disabled]),select,textarea,[tabindex="0"]',
          ),
        ];
        if (!nodes.length) {
          event.preventDefault();
          return;
        }
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (
          event.shiftKey &&
          (document.activeElement === first || document.activeElement === el)
        ) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    el?.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = old;
      el?.removeEventListener("keydown", handler);
      previous?.focus();
    };
  }, []);
  return (
    <div className="ws-drawer-backdrop" onClick={onClose}>
      <aside
        ref={ref}
        tabIndex={-1}
        className="ws-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ws-drawer-top">
          <h2>{title}</h2>
          <button
            className="ws-icon-button"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>
        {children}
      </aside>
    </div>
  );
}
