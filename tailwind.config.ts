import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./app/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./pages/**/*.{ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                border: "#2a2a2a",
                background: "#121212",
                foreground: "#ffffff",
                primary: {
                    DEFAULT: "#FF0000",
                    foreground: "#ffffff",
                },
                accent: {
                    DEFAULT: "#00FFFF",
                    foreground: "#000000",
                },
                card: {
                    DEFAULT: "#1E1E1E",
                    foreground: "#ffffff",
                },
                // Keep existing color names for backward compatibility
                "background-dark": "#121212",
                "card-dark": "#1E1E1E",
                "accent-cyan": "#00f2ff",
            },
            fontFamily: {
                display: ["Inter", "sans-serif"],
            },
            animation: {
                "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                shake: "shake 0.5s cubic-bezier(.36,.07,.19,.97) both",
                "fade-in": "fadeIn 0.5s ease-in-out",
                "slide-up": "slideUp 0.5s ease-out",
            },
            keyframes: {
                shake: {
                    "10%, 90%": {
                        transform: "translate3d(-1px, 0, 0)",
                    },
                    "20%, 80%": {
                        transform: "translate3d(2px, 0, 0)",
                    },
                    "30%, 50%, 70%": {
                        transform: "translate3d(-4px, 0, 0)",
                    },
                    "40%, 60%": {
                        transform: "translate3d(4px, 0, 0)",
                    },
                },
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { transform: "translateY(20px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
            },
        },
    },
    plugins: [],
};

export default config;
