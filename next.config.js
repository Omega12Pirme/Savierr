/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains:  ["ipfs.infura.io","sal-dapp.infura-ipfs.io"]
   }
}

module.exports = nextConfig