/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#f0f4f8',
                    100: '#d9e2ec',
                    500: '#334e68',
                    600: '#243b53',
                    900: '#102a43',
                },
                accent: {
                    500: '#f59e0b',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
}