import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      const baseUrl = "http://localhost:3000"; // Must be set in .env
      try {
        await fetch(`${baseUrl}/api/registerUser`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: user.id,
            email: user.email,
            name: user.name,
            provider: account.provider,
          }),
        });
      } catch (error) {
        console.error("Failed to register user:", error);
      }

      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
// This code sets up NextAuth with Google as the authentication provider.
// It exports the handler for both GET and POST requests, allowing NextAuth to handle authentication flows.
// Make sure to set the environment variables GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and NEXTAUTH_SECRET in your .env file.
// This configuration allows users to sign in with their Google accounts, and it uses the provided client ID and secret for authentication.
