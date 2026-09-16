import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Déléguer l'authentification au backend Spring Boot
          const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email.trim().toLowerCase(),
              password: credentials.password,
            }),
          });

          if (!res.ok) {
            console.log("❌ Connexion backend refusée:", res.status);
            return null;
          }

          const data = await res.json();
          const user = data.user;

          if (!user || !user.email) {
            return null;
          }

          console.log("✅ Connexion Spring Boot réussie pour:", user.email);

          return {
            id: user.id || user.email,
            email: user.email,
            name: user.name || `${user.prenom || ""} ${user.nom || ""}`.trim(),
            image: null,
            role: user.role || "JOUEUR",
            backendToken: data.token,
          };
        } catch (err) {
          console.error("❌ Erreur connexion backend Spring Boot:", err);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          // Enregistrer les utilisateurs Google dans Spring Boot
          const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              password: `GOOGLE_${Date.now()}_${Math.random().toString(36)}`,
              name: user.name,
              role: "JOUEUR",
            }),
          });
          // Si 400 = email déjà existant, c'est normal
          if (res.ok) {
            console.log("✅ Compte Google créé dans Spring Boot:", user.email);
          }
        } catch (err) {
          console.error("Erreur signIn Google -> Spring Boot:", err);
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.backendToken = (user as any).backendToken;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).backendToken = token.backendToken;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return `${baseUrl}/dashboard`;
    },
  },
  pages: {
    signIn: "/connexion",
    error: "/connexion",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };