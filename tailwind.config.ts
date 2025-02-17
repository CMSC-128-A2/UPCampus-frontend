import type { Config } from 'tailwindcss';

export default {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                'maroon-accent': '#8A1438',
                'green-accent': '#0C573F',
                'yellow-accent': '#FDBD59',
            },
        },
    },
    plugins: [],
} satisfies Config;
