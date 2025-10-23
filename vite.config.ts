import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { resolve } from 'node:path'
import { mockApiPlugin } from './src/vite-plugins/mockApiPlugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({ autoCodeSplitting: true }),
    viteReact(),
    tailwindcss(),
    mockApiPlugin(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0', // Permite acesso por qualquer hostname
    port: 3000,
    strictPort: false,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'cliente-alpha.local',
      'cliente-beta.local',
      'cliente-gamma.local',
      'escola-exemplo.local',
      'faculdade-teste.local',
      'tetra-admin.local',
      'bradesco.tetraeducacao.com.br',
      'itau.tetraeducacao.com.br',
    ],
    // Permite que o servidor aceite requisições de qualquer host
    // Isso permite usar cliente-alpha.local, cliente-beta.local, etc
    
    // Para evitar o aviso "Não seguro" do navegador, você pode:
    // 1. Ignorar o aviso (é apenas desenvolvimento local)
    // 2. Ou instalar mkcert e configurar HTTPS local
    
    // Descomente as linhas abaixo se quiser usar HTTPS:
    // https: {
    //   key: fs.readFileSync('./.cert/key.pem'),
    //   cert: fs.readFileSync('./.cert/cert.pem'),
    // },
  },
})
