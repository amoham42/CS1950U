/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#050816",
        secondary: "#aaa6c3",
        tertiary: "#151030",
        "black-100": "#100d25",
        "black-200": "#090325",
        "white-100": "#f3f3f3",
        glow: '#aaa6c3',
      },
      boxShadow: {
        card: "0px 35px 120px -15px #211e35",
        glow: '0 0 10px rgba(170, 166, 195, 0.5)',
      },
      screens: {
        xs: "450px",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.hover-glow': {
          position: 'relative',
          display: 'inline-block',
          transition: 'color 0.3s ease, text-shadow 0.3s ease',
        },
        '.hover-glow::after': {
          content: "''",
          position: 'absolute',
          left: '0',
          bottom: '0',
          width: '100%',
          height: '2px',
          backgroundColor: '#aaa6c3',
          opacity: '0',
          transition: 'opacity 0.3s ease',
        },
        '.hover-glow:hover::after': {
          opacity: '1',
        },
        '.hover-glow:hover': {
          color: '#aaa6c3',
          textShadow: '0 0 10px rgba(170, 166, 195, 0.5)',
        },
      });
    },
  ],
};
