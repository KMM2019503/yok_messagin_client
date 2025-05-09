"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Mars, Venus, VenusAndMars } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    email: "",
    userName: "",
    gender: "M",
    dob: new Date(),
    password: "",
    profilePictureUrl: "", // Placeholder for now
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleGenderChange = (value: string) => {
    setForm({ ...form, gender: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8888/v1/signup", {
        method: "POST",
        credentials: "include", // to accept cookie if any
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          userName: form.userName,
          gender: form.gender,
          dob: form.dob,
          passwords: form.password,
          profilePictureUrl: form.profilePictureUrl || "", // optional
        }),
      });

      const data = await response.json();

      toast({
        title: "Registered successfully!",
        description: "Welcome From The YoK",
      });
      // Optional: redirect to login
    } catch (err) {
      console.error("Register error", err);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 w-auto md:w-[35rem]")}>
      <Card className="dark:bg-[#0d1321] bg-[#48cae4] shadow-xl dark:shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Need To Talkie So Fill the Form.
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {/* Email */}
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* User Name */}
              <div className="grid gap-2">
                <label htmlFor="userName" className="text-sm">
                  User Name
                </label>
                <Input
                  autoComplete="current-password"
                  id="userName"
                  type="text"
                  value={form.userName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Gender Radio */}
              <RadioGroup
                defaultValue="M"
                value={form.gender}
                onValueChange={handleGenderChange}
                className="flex items-center gap-[1rem]"
              >
                <Label>Gender</Label>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="M" id="M" />
                  <Label htmlFor="M">
                    <Mars />
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="F" id="F" />
                  <Label htmlFor="F">
                    <Venus />
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="T" id="T" />
                  <Label htmlFor="T">
                    <VenusAndMars />
                  </Label>
                </div>
              </RadioGroup>

              {/* Date of Birth */}
              <div className="w-full flex flex-col items-start justify-center gap-4">
                <Label>Date of Birth</Label>
                <Calendar
                  mode="single"
                  selected={form.dob}
                  onSelect={(date) =>
                    setForm({ ...form, dob: date || new Date() })
                  }
                  className="rounded-md border shadow"
                />
              </div>

              {/* Password */}
              <div className="grid gap-2">
                <label htmlFor="password" className="text-sm">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Register
              </Button>

              <Button disabled variant="outline" className="w-full">
                Register with Google
              </Button>
            </div>

            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link
                href={"/auth/login"}
                className="text-gray-900 dark:text-blue-400 text-lg"
              >
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
