import { defineConfig, loadEnv } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { resolve } from "node:path";
import { mockApiPlugin } from "./src/vite-plugins/mockApiPlugin";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isLocal = env.VITE_ENV === "local" || mode === "development";

  return {
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
    server: isLocal
      ? {
          host: "0.0.0.0", // Permite acesso por qualquer hostname
          port: 3000,
          strictPort: false,
          allowedHosts: [
            "localhost",
            "127.0.0.1",
            ".tetraeducacao.com.br",
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
          // Proxy simplificado: um por serviço usando prefixo /api
          // IMPORTANTE: O proxy só funciona com chamadas RELATIVAS (sem http://)
          // Exemplo: fetch('/api/iam/auth/login') → interceptado pelo proxy
          //          fetch('http://localhost:3335/auth/login') → NÃO interceptado
          proxy: {
            // IAM: tudo que começar com /api/iam
            "^/api/iam(/|$)": {
              target: "http://localhost:3335",
              changeOrigin: true,
              secure: false,
              rewrite: (path) => path.replace(/^\/api\/iam/, ""),
              configure: (proxy) => {
                proxy.on("proxyReq", (_proxyReq, req) => {
                  console.log(
                    `[Proxy IAM] ${req.method} ${req.url} → http://localhost:3335`
                  );
                });
              },
            },
            // Tenants: tudo que começar com /api/tenants
            "^/api/tenants(/|$)": {
              target: "http://localhost:3334",
              changeOrigin: true,
              secure: false,
              rewrite: (path) => path.replace(/^\/api\/tenants/, ""),
              configure: (proxy) => {
                proxy.on("proxyReq", (_proxyReq, req) => {
                  console.log(
                    `[Proxy Tenants] ${req.method} ${req.url} → http://localhost:3334`
                  );
                });
              },
            },
          },
        }
      : {
          host: "0.0.0.0",
          port: 3000,
          strictPort: false,
          allowedHosts: ["localhost", "127.0.0.1", ".tetraeducacao.com.br"],
        },
  };
});
