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
          // Vérifier d'abord si l'utilisateur existe déjà dans Spring Boot
          const checkRes = await fetch(`${BACKEND_URL}/api/auth/user?email=${encodeURIComponent(user.email || "")}`);
          if (checkRes.ok) {
            const existing = await checkRes.json();
            (user as any).role = existing.role;
            (user as any).id = existing.id;
            console.log("✅ Compte Google existant détecté avec rôle:", existing.role);
            return true;
          }

          // Sinon récupérer le rôle sélectionné sur la page d'inscription
          let desiredRole = "JOUEUR";
          try {
            const { cookies } = await import("next/headers");
            const cookieStore = await cookies();
            desiredRole = cookieStore.get("oauth_role")?.value || "JOUEUR";
          } catch {
            // fallback
          }

          // Enregistrer les nouveaux utilisateurs Google dans Spring Boot
          const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              password: `GOOGLE_${Date.now()}_${Math.random().toString(36)}`,
              name: user.name,
              role: desiredRole,
            }),
          });
          if (res.ok) {
            const data = await res.json();
            (user as any).role = data.user?.role || desiredRole;
            (user as any).id = data.user?.id;
            console.log("✅ Compte Google créé dans Spring Boot avec rôle:", (user as any).role);
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

      // Si le rôle est manquant ou générique, synchroniser depuis le backend
      if ((!token.role || token.role === "JOUEUR") && token.email) {
        try {
          const res = await fetch(`${BACKEND_URL}/api/auth/user?email=${encodeURIComponent(token.email)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.role) token.role = data.role;
            if (data.id) token.id = data.id;
          }
        } catch (e) {
          console.error("Erreur sync rôle NextAuth:", e);
        }
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