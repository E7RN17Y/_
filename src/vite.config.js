import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        react(), // React plugin that we installed for vite.js
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
    ],
    // server: {
    //     hmr: {
    //         host: 'localhost',
    //     },
    //   }
    server: {
        host: '0.0.0.0',
        port: 3000,
        open: false,
     }
});
