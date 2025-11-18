// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  output: 'static', // Static site generation por ahora, cambiar a 'server' cuando se implemente backend
  
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
