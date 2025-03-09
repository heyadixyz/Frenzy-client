// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "workik-widget-assets.s3.amazonaws.com",
        },
      ],
    },
  };
  
  export default nextConfig;
