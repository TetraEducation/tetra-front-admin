import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { resolve } from "node:path";
import { mockApiPlugin } from "./src/vite-plugins/mockApiPlugin";

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
      "@": resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0", // Permite acesso por qualquer hostname
    port: 3000,
    strictPort: false,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "cliente-alpha.local",
      "cliente-beta.local",
      "cliente-gamma.local",
      "escola-exemplo.local",
      "faculdade-teste.local",
      "tetra-admin.local",
      "bradesco.tetraeducacao.com.br",
      "itau.tetraeducacao.com.br",
      "lucas.tetraeducacao.com.br",
    ],
    // Proxy para APIs backend (same-origin para permitir cookies SameSite=Lax)
    // IMPORTANTE: O proxy só funciona com chamadas RELATIVAS (sem http://)
    // Exemplo: fetch('/auth/login') → interceptado pelo proxy
    //          fetch('http://localhost:3335/auth/login') → NÃO interceptado
    proxy: {
      // IAM API (autenticação, usuários, sessões)
      // Intercepta rotas: /auth/*, /users/*, /oauth2-secure/*
      "/auth": {
        target: "http://localhost:3335",
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on("proxyReq", (_proxyReq, req) => {
            console.log(
              `[Proxy IAM] ${req.method} ${req.url} → http://localhost:3335`
            );
          });
        },
      },
      "/users": {
        target: "http://localhost:3335",
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on("proxyReq", (_proxyReq, req) => {
            console.log(
              `[Proxy IAM] ${req.method} ${req.url} → http://localhost:3335`
            );
          });
        },
      },
      // Proxy para rotas administrativas do IAM
      "/administrative": {
        target: "http://localhost:3335",
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on("proxyReq", (_proxyReq, req) => {
            console.log(
              `[Proxy IAM Admin] ${req.method} ${req.url} → http://localhost:3335`
            );
          });
        },
      },
      "/oauth2-secure": {
        target: "http://localhost:3335",
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on("proxyReq", (_proxyReq, req) => {
            console.log(
              `[Proxy IAM] ${req.method} ${req.url} → http://localhost:3335`
            );
          });
        },
      },
      // Proxy para API de Tenants (localhost:3334)
      "/tenants": {
        target: "http://localhost:3334",
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on("proxyReq", (_proxyReq, req) => {
            const url = req.url || "";
            console.log(
              `[Proxy Tenants] ${req.method} ${url} → http://localhost:3334`
            );
          });
        },
      },
      // Proxy apenas para rotas da API admin do IAM (impersonação, etc)
      // Não intercepta /admin do frontend (dashboard)
      "/api/admin": {
        target: "http://localhost:3335",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/admin/, "/admin"),
        secure: false,
        configure: (proxy) => {
          proxy.on("proxyReq", (_proxyReq, req) => {
            console.log(
              `[Proxy IAM Admin] ${req.method} ${req.url} → http://localhost:3335/admin`
            );
          });
        },
      },
    },
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
});
