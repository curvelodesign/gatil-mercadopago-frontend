import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
// Injeta o header que evita a tela de aviso do ngrok — reaproveitado
// nos dois prefixos de proxy, pra não duplicar a mesma configuração.
function skipNgrokWarning(proxy) {
    proxy.on("proxyReq", function (proxyReq) {
        proxyReq.setHeader("ngrok-skip-browser-warning", "true");
    });
}
export default defineConfig(function (_a) {
    var mode = _a.mode;
    var env = loadEnv(mode, process.cwd(), "");
    var backendTunnelUrl = env.BACKEND_TUNNEL_URL;
    // Só existe pra dev local (proxy até um túnel do backend). Em CI, os
    // testes mockam toda chamada de API antes de qualquer requisição sair
    // — o proxy nunca é de fato usado, então não faz sentido travar a
    // subida do Vite por causa de uma variável que só importa em dev.
    if (!backendTunnelUrl) {
        console.warn("BACKEND_TUNNEL_URL não definida — proxy /api e /mercadopago desativados (ok em CI, onde os testes mockam a API).");
    }
    return {
        plugins: [react()],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
        server: {
            port: 5173,
            allowedHosts: [".trycloudflare.com", ".lhr.life"],
            // Sem BACKEND_TUNNEL_URL (ex: em CI), não registra proxy nenhum —
            // um proxy com target undefined quebraria o Vite na primeira
            // requisição, então melhor não existir do que existir quebrado.
            proxy: backendTunnelUrl
                ? {
                    "/api": {
                        target: backendTunnelUrl,
                        changeOrigin: true,
                        configure: skipNgrokWarning,
                    },
                    "/mercadopago": {
                        target: backendTunnelUrl,
                        changeOrigin: true,
                        configure: skipNgrokWarning,
                    },
                }
                : undefined,
        },
    };
});
