/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async headers() {
    return [
      {
        // matching all API routes
        source: '/',
        headers: [
          // { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: 'https://blog.logrocket.com' }, // replace this your actual origin
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          // { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },        ]
      }
    ]
  }
}

module.exports = nextConfig
