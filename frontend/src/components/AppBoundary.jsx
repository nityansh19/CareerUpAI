import { Component } from "react";
export default class AppBoundary extends Component {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  componentDidCatch(error) {
    console.error("CareerUpAI could not render this screen:", error.name);
  }
  render() {
    if (this.state.error)
      return (
        <main className="ws-fallback">
          <h1>This screen needs a fresh start.</h1>
          <p>Your saved workspace data is still on this device.</p>
          <button
            className="ws-btn ws-btn-primary"
            onClick={() => window.location.reload()}
          >
            Reload CareerUpAI
          </button>
          <a href="/">Back to home</a>
        </main>
      );
    return this.props.children;
  }
}
