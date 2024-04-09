import { createProxyMiddleware } from "http-proxy-middleware";

// Define the proxy rules and targets
const proxyConfig = {
  "/v1/auth": { target: "http://localhost:3001", changeOrigin: true },
};

const applyProxy = (app)=> {
    
}