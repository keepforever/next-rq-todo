module.exports = {
    purge: ['./pages/**/*.jsx', './comps/**/*.jsx'],
    darkMode: 'media', // or 'media' or 'class'
    theme: {
        extend: {}
    },
    variants: {
        extend: {}
    },
    plugins: [
        require('@tailwindcss/forms'),
    ]
};
