import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
    // Node 25+ defineste un `localStorage` global (gol fara --localstorage-file) care il
    // ascunde pe cel din jsdom; il oprim ca testele sa foloseasca localStorage-ul jsdom.
    execArgv: ['--no-experimental-webstorage'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
