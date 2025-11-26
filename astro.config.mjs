// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://terapianiola.com',
  // Remove base entirely for custom domain
  output: 'static',
  adapter: staticAdapter(),
  integrations: [tailwind()],
});
