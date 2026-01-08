/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                metro: {
                    900: '#1a1a1a',
                    800: '#2d2d2d',
                    500: '#ef4444', // Red for Metrobus
                }
            }
        },
    },
    plugins: [],
}
