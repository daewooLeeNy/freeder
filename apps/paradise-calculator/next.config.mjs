const prefix =
  process.env.NODE_ENV === 'production' ? 'https://keep-ones.me/mystudyshare' : ''


/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/mystudyshare'
  // assetPrefix: prefix
};

export default nextConfig;
