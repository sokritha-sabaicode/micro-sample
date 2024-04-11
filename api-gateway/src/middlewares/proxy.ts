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
  },
};

const applyProxy = (app: express.Application) => {
  Object.keys(proxyConfigs).forEach((context: string) => {
    app.use(context, createProxyMiddleware(proxyConfigs[context]));
    console.log(context);
    console.log(proxyConfigs[context]);
  });
};

export default applyProxy;
