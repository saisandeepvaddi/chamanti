/// <reference types="vitest" />

import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lib/index.ts'),
      name: 'chamanti',
      fileName: 'chamanti',
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        globals: {
          chamanti: 'Chamanti',
        },
      },
    },
  },
  test: {},
  plugins: [glsl(), dts({ rollupTypes: true })],
});
