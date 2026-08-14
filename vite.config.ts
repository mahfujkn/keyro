import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// Move script to bottom of <body> and clean attributes
const moveScriptToBody = () => ({
  name: 'move-script-to-body',
  transformIndexHtml(html: string) {
    let clean = html
      .replace(/ crossorigin=""/g, '')
      .replace(/ crossorigin/g, '')
      .replace(/ type="module"/g, '');

    const scriptRegex = /<script[^>]*>[\s\S]*?<\/script>/gi;
    const scripts: string[] = [];
    clean = clean.replace(scriptRegex, (match) => {
      scripts.push(match);
      return '';
    });

    return clean.replace('</body>', `${scripts.join('\n')}\n</body>`);
  },
});

export default defineConfig({
  plugins: [react(), moveScriptToBody()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    modulePreload: false,
    target: 'es2020',
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup.html'),
      },
      output: {
        format: 'iife',
        name: 'KeyroPopup',
        inlineDynamicImports: true,
        entryFileNames: 'popup.js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
});
