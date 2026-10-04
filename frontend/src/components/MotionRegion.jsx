import { useEffect, useRef } from "react";

const ITEMS =
  "[data-motion-item], .ws-page-head, .ws-command-center, .ws-card, .ws-section-head, .ws-info-note";

export default function MotionRegion({
  as: Element = "div",
  className = "",
  children,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!root || preference.matches || !("IntersectionObserver" in window))
      return;

    const seen = new Set();
    const reveal = (element) => {
      element.dataset.motionState = "visible";
      observer.unobserve(element);
    };
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) reveal(entry.target);
        }),
      { threshold: 0.06, rootMargin: "0px 0px -16px 0px" },
    );
    const register = () => {
      root.querySelectorAll(ITEMS).forEach((element) => {
        if (seen.has(element)) return;
        element.style.setProperty(
          "--cu-reveal-delay",
          `${(seen.size % 4) * 45}ms`,
        );
        seen.add(element);
        element.classList.add("cu-reveal");
        element.dataset.motionState = "pending";
        observer.observe(element);
      });
    };
    const focus = (event) => {
      let element = event.target.closest(".cu-reveal");
      while (element && root.contains(element)) {
        reveal(element);
        element = element.parentElement?.closest(".cu-reveal");
      }
    };
    const reduce = () => {
      if (preference.matches) seen.forEach(reveal);
    };
    // Newly added reports and opportunities get the same one-time entrance.
    const mutations = new MutationObserver(register);
    register();
    mutations.observe(root, { childList: true, subtree: true });
    root.addEventListener("focusin", focus);
    preference.addEventListener("change", reduce);

    return () => {
      observer.disconnect();
      mutations.disconnect();
      root.removeEventListener("focusin", focus);
      preference.removeEventListener("change", reduce);
      seen.forEach((element) => {
        element.classList.remove("cu-reveal");
        delete element.dataset.motionState;
        element.style.removeProperty("--cu-reveal-delay");
      });
    };
  }, []);

  return (
    <Element ref={ref} className={className}>
      {children}
    </Element>
  );
}
