import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import userLogin from "@/libs/userLogIn";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const user = await userLogin(credentials.email, credentials.password);
        if (!user?.token) return null;

        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://fe-project-68-bongbing-backend.vercel.app";
        const profileRes = await fetch(
          `${backendUrl}/api/v1/auth/me`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );

        if (!profileRes.ok) return null;

        const profileData = await profileRes.json();
        const profile = profileData.data; // Backend usually wraps in .data

        // Return the object that will be passed to the JWT callback
        return {
          id: profile._id, // NextAuth internally uses 'id'
          _id: profile._id, // Add this for consistency with your frontend
          name: profile.name,
          email: profile.email,
          role: profile.role,
          token: user.token,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      // 'user' is only available the very first time this callback is called (at login)
      if (user) {
        token._id = (user as any)._id; // Store MongoDB ID
        token.role = (user as any).role;
        token.token = (user as any).token;
      }
      return token;
    },
    async session({ session, token }) {
      // Pass the data from the token into the session object for the frontend
      if (session.user) {
        (session.user as any)._id = token._id;
        (session.user as any).role = token.role;
        (session.user as any).token = token.token;
      }
      return session;
    },
  },
};