module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./App.tsx"],
  theme: {
    extend: {
      colors: {
        sanctuary: {
          forest: "#0B1A14",
          moss: "#142E24",
          sage: "#234C3D",
          "sage-light": "#E9F1ED",
          gold: "#D99B43",
          "gold-hover": "#C58934",
          "gold-light": "#FDF7EE",
          pearl: "#FAF8F5",
          sand: "#F2EDE4",
          dark: "#0C1117",
          charcoal: "#1A232D",
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "sans-serif"],
        serif: ['"Cormorant Garamond"', "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
