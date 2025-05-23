"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/providers/auth-store-provider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Login = () => {
  const { login } = useAuthStore((state) => state);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8888/v1/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      
      console.log("🚀 ~ handleLogin ~ data:", data)
      login({
        id: data.user.id,
        userName: data.user.userName,
        email: data.user.email,
        userUniqueID: data.user.userUniqueID,
      });

      toast({
        title: "Logged in successfully!",
        description: `Welcome Back, ${data.user.userName}`,
      });

      router.push("/content/chats");
    } catch (error: any) {
      console.log("🚀 ~ handleLogin ~ error:", error);
      toast({
        title: "Login failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 w-auto md:w-[35rem]")}>
      <Card className="dark:bg-[#0d1321] bg-[#48cae4] shadow-xl dark:shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome Homie</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm">
                  Email
                </label>
                <Input
                  autoComplete="current-password"
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="password" className="text-sm">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>

              <Button disabled variant="outline" className="w-full">
                Login with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href={"/auth/register"}
                className="text-gray-900 dark:text-blue-400 text-lg"
              >
                Register Now
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
