// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://tafano.github.io',
  base: '/niolaterapia.com',
  output: 'static',
  vite: {
    plugins: [tailwindcss()]
  }
});