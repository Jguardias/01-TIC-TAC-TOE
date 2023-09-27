import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'


export default defineConfig({
  plugins: [react()],
  server:{
    proxy:{
      '/socket.io': {
        target: 'https://rendersocketserver.onrender.com/', 
        ws: true,
        secure: false,
      },
    },
  },
});
