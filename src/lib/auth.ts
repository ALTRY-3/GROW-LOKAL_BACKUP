import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { MongoClient } from "mongodb";
import User from "@/models/User";
import connectDB from "@/lib/mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
const clientPromise = client.connect();

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await connectDB();
          
          const user = await User.findOne({ email: credentials.email }).select('+password');
          
          if (!user) {
            return null;
          }

          const isPasswordValid = await user.comparePassword(credentials.password);
          
          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "facebook") {
        try {
          await connectDB();
          
          // Check if user already exists
          let existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            // Create new user
            existingUser = await User.create({
              name: user.name,
              email: user.email,
              provider: account.provider,
              providerId: account.providerAccountId,
              image: user.image,
              emailVerified: true, // OAuth users are automatically verified
            });
          } else {
            // Update existing user with OAuth info regardless of current provider
            existingUser.provider = account.provider as 'google' | 'facebook';
            existingUser.providerId = account.providerAccountId;
            existingUser.image = user.image;
            existingUser.emailVerified = true;
            await existingUser.save();
          }
          
          return true;
        } catch (error) {
          console.error('SignIn callback error:', error);
          return true; // Allow sign in even if database update fails
        }
      }
      
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // If user is signing in with OAuth, redirect to marketplace
      if (url.includes('/api/auth/callback/')) {
        return `${baseUrl}/marketplace`;
      }
      // For other redirects, use the provided URL or default to base
      return url.startsWith("/") ? `${baseUrl}${url}` : url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
};