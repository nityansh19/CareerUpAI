import { defineConfig, loadEnv } from "vite";
import process from "node:process";
// Added: explicitly import the Node environment used by this build-time configuration.
// Changed: load the frontend's deployment environment before building.
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ command, mode }) => {
  if (command === "build") {
    const env = loadEnv(mode, process.cwd(), "VITE_");
    const address = process.env.VITE_API_URL || env.VITE_API_URL;
    let valid = false;
    try {
      const url = new URL(address);
      valid = url.protocol === "https:" && !url.username && !url.password &&
        !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) &&
        url.pathname === "/" && !url.search && !url.hash;
    } catch { /* An absent or malformed address must fail the production build. */ }
    if (!valid) throw new Error("Set VITE_API_URL to the backend HTTPS origin in Netlify before building (no /api path).");
  }
  // Added: fail production builds with a missing, local, insecure or malformed backend address.
  return {
  plugins: [
    react(),
    tailwindcss(),
  ],
  };
});
// Changed: retain the existing frontend plugins after validating deployment configuration.
