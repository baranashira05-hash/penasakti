import NextAuth from "next-auth";
import authOptions from "@/lib/auth";

const handler = NextAuth({
  ...authOptions,
  debug: process.env.NODE_ENV !== "production",
  secret: authOptions.secret || process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  trustHost: true,
});

export { handler as GET, handler as POST };
