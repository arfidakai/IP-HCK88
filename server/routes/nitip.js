module.exports = {
  apps: [
    {
      name: "ip-hck88-server",
      script: "./server.js",
      watch: true,
        env:{
        NODE_ENV: "production",
        PORT: 80,
        DATABASE_URL="postgresql://postgres.qpxisqxoocxbmarvduau:qDSBDZ2YZ2TugbLX@aws-1-us-east-2.pooler.supabase.com:6543/postgres",
        GEMINI_API_KEY="AIzaSyBDseASp3OqpSbaRLpmOXAVn39io604tQ4",
        YOUTUBE_API_KEY="AIzaSyDJXjgNROEwJzp5gPmlA1W3mbABlTL8W2w",
        JWT_SECRET="jwtrahasia",
        SESSION_SECRET="another-secret-change-me",
        GOOGLE_CLIENT_ID="774950337779-6ie9c6ako473kifpkocj2mtsg5kgupuk.apps.google",
        GOOGLE_CLIENT_SECRET="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"

      },
    },
  ],
};
