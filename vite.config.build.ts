import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [svelte()],
  build: {
    // rollupOptions: {
    //   input: ['./src/lib/smart-toolbar.svelte'],
    // }
    lib: {
      entry: './src/main.ts',
      name: 'smart-toolbar',
    },
  },
  plugins: [
    svelte({
      compilerOptions: {
        customElement: true,
      },
    }),
  ],
  css: {
    postcss: {
      plugins: [
      tailwindcss, autoprefixer
      ]
    }
  }
})
