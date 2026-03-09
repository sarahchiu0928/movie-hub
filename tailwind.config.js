/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        cinepulse: {
          "primary":          "#4f46e5", // indigo-600
          "primary-focus":    "#6366f1", // indigo-500
          "primary-content":  "#ffffff",
          "secondary":        "#7c3aed", // violet-600
          "secondary-content":"#ffffff",
          "accent":           "#f59e0b",
          "neutral":          "#1e293b", // slate-800
          "base-100":         "#020617", // slate-950
          "base-200":         "#0f172a", // slate-900
          "base-300":         "#1e293b", // slate-800
          "base-content":     "#f8fafc", // slate-50
          "info":             "#38bdf8",
          "success":          "#4ade80",
          "warning":          "#f59e0b",
          "error":            "#ef4444",
        },
      },
    ],
  },
}
