import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: "https",
        hostname: "www.sportspro.com",
      },
      {
        protocol: "https",
        hostname: "www.newscaststudio.com",
      },
      {
        protocol: "https",
        hostname: "coreflexind.com",
      },
      {
        protocol: "https",
        hostname: "images.seattletimes.com",
      },
      {
        protocol: "https",
        hostname: "admin.esports.gg",
      },
      {
        protocol: "https",
        hostname: "img.redbull.com",
      },
      {
        protocol: "https",
        hostname: "esportsinsider.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
    ],
  },
}


export default nextConfig;
