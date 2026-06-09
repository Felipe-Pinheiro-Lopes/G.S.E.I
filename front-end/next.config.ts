import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  // Para fins de documentação dos requisitos de produção do Prof Gabriel:
  // - reactStrictMode: garante boas práticas no desenvolvimento e previne efeitos colaterais.
  // - compress: habilita compressão Brotli/Gzip automática de bundles de produção.
  // - output: 'standalone', // Habilitar caso faça deploy via Docker/Render.
};

export default nextConfig;
