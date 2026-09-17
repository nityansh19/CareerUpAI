# Accessibility Checklist

CareerUpAI should remain usable without relying on mouse precision, color alone or animation.

## Interface rules

- Use semantic HTML before custom roles.
- Give form controls visible labels.
- Keep keyboard focus visible.
- Ensure interactive elements are reachable in a logical tab order.
- Provide useful alternative text for informative images.
- Do not use color as the only signal for success, warning or error states.
- Respect reduced-motion preferences for large transitions.

## Review

Test core flows with keyboard-only navigation and check common contrast issues before release. Accessibility regressions should be treated as functional bugs, not cosmetic polish.
