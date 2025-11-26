// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://niolaterapia.com',
  output: 'static',
  integrations: [tailwind()],
});
