/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "media",
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
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
            colors: {
                border: "var(--border)",
                input: "var(--input)",
                ring: "var(--ring)",
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: {
                    DEFAULT: "var(--primary)",
                    foreground: "var(--primary-foreground)",
                },
                secondary: {
                    DEFAULT: "var(--secondary)",
                    foreground: "var(--secondary-foreground)",
                },
                destructive: {
                    DEFAULT: "var(--destructive)",
                    foreground: "var(--destructive-foreground)",
                },
                muted: {
                    DEFAULT: "var(--muted)",
                    foreground: "var(--muted-foreground)",
                },
                accent: {
                    DEFAULT: "var(--accent)",
                    foreground: "var(--accent-foreground)",
                },
                popover: {
                    DEFAULT: "var(--popover)",
                    foreground: "var(--popover-foreground)",
                },
                card: {
                    DEFAULT: "var(--card)",
                    foreground: "var(--card-foreground)",
                },
                sidebar: {
                    DEFAULT: "var(--sidebar)",
                    foreground: "var(--sidebar-foreground)",
                    primary: "var(--sidebar-primary)",
                    "primary-foreground": "var(--sidebar-primary-foreground)",
                    accent: "var(--sidebar-accent)",
                    "accent-foreground": "var(--sidebar-accent-foreground)",
                    border: "var(--sidebar-border)",
                    ring: "var(--sidebar-ring)",
                },
                chart: {
                    1: "var(--chart-1)",
                    2: "var(--chart-2)",
                    3: "var(--chart-3)",
                    4: "var(--chart-4)",
                    5: "var(--chart-5)",
                },
            },
            borderRadius: {
                lg: `var(--radius)`,
                md: `calc(var(--radius) - 2px)`,
                sm: "calc(var(--radius) - 4px)",
            },
            fontFamily: {
                sans: ["var(--font-sans)", "system-ui", "sans-serif"],
                serif: ["var(--font-serif)", "Georgia", "serif"],
                mono: ["var(--font-mono)", "monospace"],
            },
            letterSpacing: {
                tighter: "calc(var(--tracking-normal) - 0.05em)",
                tight: "calc(var(--tracking-normal) - 0.025em)",
                normal: "var(--tracking-normal)",
                wide: "calc(var(--tracking-normal) + 0.025em)",
                wider: "calc(var(--tracking-normal) + 0.05em)",
                widest: "calc(var(--tracking-normal) + 0.1em)",
            },
            typography: {
                DEFAULT: {
                    // Use a function form to access theme colors
                    css: ({ theme }) => ({
                        color: theme('colors.foreground'),
                        'h1, h2, h3, h4, h5, h6': {
                            color: theme('colors.foreground'),
                            fontWeight: '600',
                            fontStyle: 'italic',
                        },
                        a: {
                            color: theme('colors.chart.2'),
                            textDecoration: 'none',
                            '&:hover': {
                                textDecoration: 'underline',
                            },
                        },
                        hr: { borderColor: theme('colors.border') },
                        blockquote: {
                            color: theme('colors.muted.foreground'),
                            borderLeftColor: theme('colors.primary'),
                        },
                        code: {
                            color: theme('colors.foreground'),
                            backgroundColor: theme('colors.muted'),
                        },
                        pre: {
                            backgroundColor: theme('colors.muted'),
                            borderColor: theme('colors.border'),
                        },
                        th: { color: theme('colors.foreground') },
                        td: { color: theme('colors.foreground') },
                    }),
                },
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
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [require("tailwindcss-animate"), require('@tailwindcss/typography')],
}

