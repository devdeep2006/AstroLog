import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      backgroundImage: {
        bannerImg: "url('/space-background.jpg')",
      },
    },
  },
  plugins: [],
};

export default config;
