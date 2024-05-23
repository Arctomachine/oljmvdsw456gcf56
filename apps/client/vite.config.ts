import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    proxy:{
      '/messages': 'http://localhost:3210',
      '/ws': {
        target: 'http://localhost:3211',
        ws: true
      }
    },
  }
})
