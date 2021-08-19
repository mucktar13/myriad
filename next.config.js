module.exports = {
  serverRuntimeConfig: {
    // Will only be available on the server side
    nextAuthURL: process.env.NEXTAUTH_URL,
    secret: process.env.SECRET,
    twitterBearerToken: process.env.TWITTER_BEARER_TOKEN,
    cloudinaryAPIKey: process.env.CLOUDINARY_API_KEY,
    cloudinarySecret: process.env.CLOUDINARY_SECRET,
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    appName: process.env.NEXT_PUBLIC_APP_NAME,
    apiURL: process.env.NEXT_PUBLIC_API_URL,
    facebookAppId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
    myriadWsRPC: process.env.NEXT_PUBLIC_MYRIAD_WS_RPC,
    myriadCryptoType: process.env.NEXT_PUBLIC_MYRIAD_CRYPTO_TYPE,
    myriadAddressPrefix: process.env.NEXT_PUBLIC_MYRIAD_ADDRESS_PREFIX,
    cloudinaryName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    firebaseAPIKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    firebaseProjectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    firebaseMessagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    firebaseAppId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    });

    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        test: /\.(js|ts)x?$/,
      },
      use: ['@svgr/webpack'],
    });

    return config;
  },
};
