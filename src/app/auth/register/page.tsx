"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Mars, Venus, VenusAndMars } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

const Register = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <>
      <div className={cn("flex flex-col gap-6 w-auto md:w-[35rem]")}>
        <Card className="dark:bg-[#0d1321] bg-[#48cae4] shadow-xl dark:shadow-none">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Need To Talkie So Fill the Form.
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <label htmlFor="email" className="text-sm">
                    Email
                  </label>
                  <Input id="email" type="email" required />
                </div>
                {/* User Name */}
                <div className="grid gap-2">
                  <label htmlFor="user_name" className="text-sm">
                    User Name
                  </label>
                  <Input id="user_name" type="text" required />
                </div>
                {/* Gender Radio */}
                <RadioGroup
                  defaultValue="M"
                  className="flex items-center gap-[1rem]"
                >
                  <Label>Gender</Label>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="M" id="M" />

                    <Label htmlFor="M">
                      {" "}
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
                <div className="w-full flex flex-col items-start justify-center gap-4">
                <Label>Date of Birth</Label>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border shadow"
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center"></div>
                  <label htmlFor="password" className="text-sm">
                    Passwords
                  </label>
                  <Input id="password" type="password" required />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
                <Button disabled variant="outline" className="w-full">
                  Login with Google
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                already have an account?{" "}
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
    </>
  );
};

export default Register;
