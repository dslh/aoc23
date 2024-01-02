import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import plainText from 'vite-plugin-plain-text'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    plainText(
      ['**/*.text', /\.test$/],
      { namedExport: false }
    ),
  ],
})
