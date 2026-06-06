import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      '@pages': path.resolve(__dirname, './src/b_pages'),
      '@widgets': path.resolve(__dirname, './src/c_widgets'),
      '@features': path.resolve(__dirname, './src/d_features'),
      '@entities': path.resolve(__dirname, './src/e_entities'),
      '@shared': path.resolve(__dirname, './src/f_shared'),
      '@test': path.resolve(__dirname, './test'),
    },
  },
});
