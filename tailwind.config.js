/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        tera: {
          red: {
            DEFAULT: "#b80035",
            hover: "#9f002d",
            dark: "#93000a",
            light: "#fff1f2",
            border: "#ffdad6",
          },
          navy: {
            DEFAULT: "#0b1c30",
            dark: "#06101c",
            light: "#1e293b",
          },
          slate: "#213145",
          muted: "#5c5e64",
          surface: "#f8f9ff",
          surfaceLight: "#eff4ff",
          pill: "#e5eeff",
          pillBorder: "#dce9ff",
          teal: {
            DEFAULT: "#00675e",
            light: "#ecfdf5",
          },
          green: {
            DEFAULT: "#059669",
            light: "#ecfdf5",
          },
          amber: {
            DEFAULT: "#d97706",
            light: "#fffbeb",
            dark: "#78350f",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        display: ["var(--font-jakarta)", "Plus Jakarta Sans", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        card: "0px 1px 1px 0px rgba(0, 0, 0, 0.05)",
        cardHover: "0px 4px 12px 0px rgba(0, 0, 0, 0.08)",
        drawer: "-8px 0px 24px 0px rgba(11, 28, 48, 0.15)",
      },
    },
  },
  plugins: [],
};
