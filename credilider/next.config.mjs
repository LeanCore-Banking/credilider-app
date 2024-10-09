/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'via.placeholder.com',
          port: '', // Deja vacío si no necesitas especificar un puerto
          pathname: '/**', // Acepta cualquier ruta del dominio
        },
        {
          protocol: 'https',
          hostname: 'drive.google.com',
          port: '', // Deja vacío si no necesitas especificar un puerto
          pathname: '/**', // Acepta cualquier ruta del dominio
        },
      ],
    },
  };
  
  export default nextConfig;
  