import express from "express";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import { ROUTE_PATHS } from "../route-defs";
import { config } from "../index";

interface ProxyConfig {
  [context: string]: Options;
}

// Define the proxy rules and targets
const proxyConfigs: ProxyConfig = {
  [ROUTE_PATHS.AUTH_SERVICE]: {
    target: config.auth_service_url,
    changeOrigin: true,
    pathRewrite: (path, req) => {
      return `${ROUTE_PATHS.AUTH_SERVICE}${path}`;
    },
    on: {
      proxyReq: (proxyReq, req, res) => {
        console.error(
          `Proxying request from: ${req.url} to: ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`
        );
      },
    },
  },
};

const applyProxy = (app: express.Application) => {
  Object.keys(proxyConfigs).forEach((context: string) => {
    app.use(context, createProxyMiddleware(proxyConfigs[context]));
  });
};

export default applyProxy;
