import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  pages: {
    signIn: "/login",
    signOut: "/logout",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id || user.email || user.name || crypto.randomUUID();
        token.avatar = user.image || user.avatar;
        token.role = user.role;
        token.permissions = user.permissions;
        token.organizationId = user.organizationId;
      }
      return token;
    },
    session({ session, token }) {
      // Add custom token properties to the session
      if (token && session.user) {
        session.user.id = token.id;
        session.user.avatar = token.avatar;
        session.user.role = token.role;
        session.user.permissions = token.permissions;
        session.user.organizationId = token.organizationId;
      }
      return session;
    },
  },
});
