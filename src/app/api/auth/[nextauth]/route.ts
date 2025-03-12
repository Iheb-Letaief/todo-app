import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    // Use your existing login endpoint
                    const response = await axios.post(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
                        {
                            email: credentials.email,
                            password: credentials.password,
                        }
                    );

                    if (response.data && response.data.token) {
                        // Return user data that will be stored in the JWT
                        return {
                            id: response.data.user.id,
                            name: response.data.user.name,
                            email: response.data.user.email,
                            role: response.data.user.role,
                            token: response.data.token, // We'll store the token to use for API calls
                        };
                    }

                    return null;
                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            // Initial sign in
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.token = user.token;
            }
            return token;
        },
        async session({ session, token }) {
            // Send properties to the client
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.token = token.token;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
        signOut: "/login",
        error: "/login",
    },
    session: {
        strategy: "jwt",
    },
});

export { handler as GET, handler as POST };