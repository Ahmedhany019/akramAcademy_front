/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#172853",
          dark: "#082F3D",
          sidebar: "#052F3E",
          hover: "#0a4b60",
        },
        cyanAccent: {
          DEFAULT: "#0EA5C6",
          hover: "#0891b2",
          light: "#E0F7FA",
        },
        surface: {
          bg: "#F7F9FA",
          card: "#FFFFFF",
          border: "#E5E7EB",
        },
        textPrimary: "#111827",
        textSecondary: "#6B7280",
      },
      fontFamily: {
        tajawal: ["Tajawal", "Cairo", "sans-serif"],
      },
      borderRadius: {
        '2xl': '1rem',
        'xl': '0.75rem',
      },
      boxShadow: {
        'soft': '0 2px 10px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 4px 20px -2px rgba(6, 59, 76, 0.05)',
      },
    },
  },
  plugins: [],
};
