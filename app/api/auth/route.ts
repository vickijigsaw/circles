import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // Replace this with your real user lookup (DB, API, etc.)
                if (
                    credentials?.email === "test@example.com" &&
                    credentials?.password === "password123"
                ) {
                    return { id: "1", name: "Test User", email: "test@example.com" };
                }
                return null;
            },
        }),
    ],
    pages: {
        signIn: "/login", // optional — point to your Shadcn login page
    },
    session: { strategy: "jwt" },
});

export { handler as GET, handler as POST };
