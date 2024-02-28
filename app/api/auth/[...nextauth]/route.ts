
import NextAuth from 'next-auth';
import GoogleProvider from "next-auth/providers/google";

export const authOptions = { 
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
          })
    ],  
    callbacks: {
            async jwt({ token, account }: { token: any, account: any }) {
                if (account) {
                    token.accessToken = account.access_token;
                }
                return token;
            },
            async session({ session, token, user }: { session: any, token: any, user: any }) {
                session.accessToken = token.accessToken;
                return session;
            },
        },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST};