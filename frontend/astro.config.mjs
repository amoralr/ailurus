// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'server', // SSR mode for dynamic API calls (changed from 'static')
  adapter: node({
    mode: 'standalone'
  }),
  site: 'https://ailurus-docs.dev', // Change to your production domain
  
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],

  vite: {
    ssr: {
      noExternal: ['@nanostores/react', 'nanostores'],
    },
  },

  server: {
    port: 4321,
    host: true,
  },
});
