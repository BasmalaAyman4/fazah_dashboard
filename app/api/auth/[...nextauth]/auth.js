import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/mongoose";
import { Instructor } from "@/lib/mongoose";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        try {
          if (
            !credentials?.email ||
            !credentials?.password ||
            !credentials?.role
          ) {
            throw new Error("Missing credentials");
          }

          await connectDB();

          if (credentials.role === "instructor") {
            const instructor = await Instructor.findOne({
              email: credentials.email,
            });

            if (!instructor) {
              throw new Error("البريد الإلكتروني غير موجود");
            }

            if (!instructor.password) {
              throw new Error("كلمة المرور غير موجودة");
            }

            const isValid = await bcrypt.compare(
              credentials.password,
              instructor.password
            );

            if (!isValid) {
              throw new Error("كلمة المرور غير صحيحة");
            }

            return {
              id: instructor._id.toString(),
              email: instructor.email,
              name: instructor.name,
              role: "instructor",
            };
          } else if (credentials.role === "admin") {
            // Handle admin authentication
            if (
              credentials.email === process.env.ADMIN_EMAIL &&
              credentials.password === process.env.ADMIN_PASSWORD
            ) {
              return {
                id: "admin",
                email: credentials.email,
                name: "Admin",
                role: "admin",
              };
            }
            throw new Error("بيانات المدير غير صحيحة");
          } else {
            throw new Error("نوع الحساب غير صحيح");
          }
        } catch (error) {
          console.error("Auth error:", error);
          throw new Error(error.message);
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // If the URL is relative, prefix it with the base URL
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      // If the URL is already absolute, return it
      return url;
    },
  },
  debug: process.env.NODE_ENV === "development",
};
