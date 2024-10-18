import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    base: "/PE_Recursos3D/",
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                nested: resolve(__dirname, 'viewer.html'),
            },
        },
    },
})