"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("instructor");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { data: session, status } = useSession();

  // Log user role when session changes
  useEffect(() => {
    console.log("Login page - Session status:", status);
    console.log("Login page - Session data:", session);

    if (status === "authenticated" && session?.user?.role) {
      console.log("Login page - User role:", session.user.role);

      // Use a small delay to ensure the session is fully established
      const redirectTimer = setTimeout(() => {
        if (session.user.role === "admin") {
          console.log("Login page - Redirecting to dashboard...");
          router.push("/dashboard");
        } else if (session.user.role === "instructor") {
          console.log("Login page - Redirecting to instructor...");
          router.push("/instructor");
        }
      }, 500);

      return () => clearTimeout(redirectTimer);
    }
  }, [status, session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Login page - Attempting to sign in...");
      const result = await signIn("credentials", {
        email,
        password,
        role,
        redirect: false,
      });

      console.log("Login page - Sign in result:", result);

      if (result?.error) {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: result.error,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // The session will be updated automatically by NextAuth
      // The useEffect hook will handle the redirection
      console.log(
        "Login page - Sign in successful, waiting for session update..."
      );
    } catch (error) {
      console.error("Login page - Login error:", error);
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "حدث خطأ أثناء محاولة تسجيل الدخول",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">تسجيل الدخول</CardTitle>
          <CardDescription className="text-center">
            أدخل بريدك الإلكتروني وكلمة المرور للوصول إلى لوحة التحكم
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">نوع الحساب</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الحساب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instructor">مدرب</SelectItem>
                  <SelectItem value="admin">مدير</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
