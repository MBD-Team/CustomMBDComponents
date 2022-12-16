import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    watch: {
      usePolling: true, //to be able to use this on windows using wsl2 we need polling see: http://github.com/microsoft/WSL/issues/4739
    },
  },
  plugins: [vue()],
  root: './',
});
