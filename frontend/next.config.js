/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    RPC_URL_IOTA_EVM: 'https://evm.wasp.sc.iota.org',
  },
}

module.exports = nextConfig
