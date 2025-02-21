import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com", "grupouma.com", "zagamotos.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "", // Deja vacío si no necesitas especificar un puerto
        pathname: "/**", // Acepta cualquier ruta del dominio
      },
      {
        protocol: "https",
        hostname: "drive.google.com",
        port: "", // Deja vacío si no necesitas especificar un puerto
        pathname: "/**", // Acepta cualquier ruta del dominio
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

const sentryWebpackPluginOptions = {
  silent: true,
  org: "tu-organizacion",
  project: "tu-proyecto",
};

export default withSentryConfig(
  nextConfig,
  sentryWebpackPluginOptions
);
