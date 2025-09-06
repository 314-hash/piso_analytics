/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--color-border)", /* white-10 */
        input: "var(--color-input)", /* elevated-panel */
        ring: "var(--color-ring)", /* electric-blue */
        background: "var(--color-background)", /* true-dark */
        foreground: "var(--color-foreground)", /* white */
        primary: {
          DEFAULT: "var(--color-primary)", /* electric-blue */
          foreground: "var(--color-primary-foreground)", /* true-dark */
        },
        secondary: {
          DEFAULT: "var(--color-secondary)", /* deep-slate */
          foreground: "var(--color-secondary-foreground)", /* white */
        },
        destructive: {
          DEFAULT: "var(--color-destructive)", /* red-500 */
          foreground: "var(--color-destructive-foreground)", /* white */
        },
        muted: {
          DEFAULT: "var(--color-muted)", /* deep-slate */
          foreground: "var(--color-muted-foreground)", /* muted-gray */
        },
        accent: {
          DEFAULT: "var(--color-accent)", /* cyber-green */
          foreground: "var(--color-accent-foreground)", /* true-dark */
        },
        popover: {
          DEFAULT: "var(--color-popover)", /* elevated-panel */
          foreground: "var(--color-popover-foreground)", /* white */
        },
        card: {
          DEFAULT: "var(--color-card)", /* elevated-panel */
          foreground: "var(--color-card-foreground)", /* white */
        },
        success: {
          DEFAULT: "var(--color-success)", /* green-500 */
          foreground: "var(--color-success-foreground)", /* white */
        },
        warning: {
          DEFAULT: "var(--color-warning)", /* amber-500 */
          foreground: "var(--color-warning-foreground)", /* white */
        },
        error: {
          DEFAULT: "var(--color-error)", /* red-500 */
          foreground: "var(--color-error-foreground)", /* white */
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'primary': 'var(--shadow-primary)',
        'depth': 'var(--shadow-depth)',
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-status": "pulse-status 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-status": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}