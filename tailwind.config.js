module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#38473b',
        ink: '#3c3b3a',
        blush: '#f3e9e9',
        rose: '#ead6d6',
        'accent-pink': '#E8BFC6',
        white: '#ffffff',
        black: '#000000',
      },
      fontFamily: {
        body: ['Neue Haas Grotesk Display', 'sans-serif'],
        heading: ['Reckless Neue', 'serif'],
        script: ['French Pirates', 'Reckless Neue', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.75s ease-out',
        'slide-up': 'slideUp 0.75s ease-out',
        'scale-in': 'scaleIn 1.1s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(31px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(1.05)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
