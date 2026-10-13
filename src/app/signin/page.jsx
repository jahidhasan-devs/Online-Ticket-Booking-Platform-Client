"use client";

import { authClient } from "@/lib/auth-client";
import {
  Button,
  Description,
  FieldError,
  Fieldset,
  Form,
  Input,
  Label,
  Surface,
  ListBox,
  Select,
  TextField,
} from "@heroui/react";
import Link from "next/link";
import {  useRouter } from "next/navigation";

import React from "react";
import { FcGoogle } from "react-icons/fc";

export default function SignUpPage() {
  const router = useRouter();
  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries());

    try {
      const { error } = await authClient.signIn.email({
        ...user,
        plan: "free",
      });

      if (error) {
        alert(error.message || "Signup failed. Please try again.");
        return;
      }

      alert("Successfully signed up!");
      router.push("/");
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
  };

  // for google login
  const handleGoogle = async () => {
    await authClient.signIn.social({
      provider: "google",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/60 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/40 px-4 py-10">
      <div className="w-full max-w-md">
        {/* Card */}
        <Surface className="w-full rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white/90 dark:bg-slate-900/90 shadow-xl shadow-slate-200/50 dark:shadow-black/40 backdrop-blur-sm">
          <div className="px-8 pt-10 pb-8">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Login your account
              </h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Welcome back! Please Login  to continue
              </p>
            </div>

            <Form onSubmit={onSubmit}>
              <Fieldset className="w-full space-y-5">
                <Fieldset.Group className="space-y-5">
                  {/* Email */}
                  <TextField isRequired name="email" type="email">
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Email Address
                    </Label>
                    <Input
                      placeholder="Enter Your email-address"
                      variant="secondary"
                      className="mt-1.5"
                    />
                    <FieldError />
                  </TextField>

                  {/* Password */}
                  <TextField isRequired name="password" type="password">
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Password
                    </Label>
                    <Input
                      placeholder="Create a strong password"
                      variant="secondary"
                      className="mt-1.5"
                    />
                    <FieldError />
                  </TextField>
                </Fieldset.Group>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="mt-2 w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 dark:shadow-blue-900/40 transition-all duration-200"
                >
                  login
                </Button>
              </Fieldset>
            </Form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white dark:bg-slate-900 px-4 text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Sign In */}
            <Button
              onClick={handleGoogle}
              variant="bordered"
              className="group w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-medium shadow-sm hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-slate-800 hover:shadow-md transition-all duration-200"
            >
              <FcGoogle className="text-xl transition-transform duration-300 group-hover:scale-110" />
              <span className="ml-3">Continue with Google</span>
            </Button>

            <p className="mt-3 text-center text-xs text-slate-400 dark:text-slate-500">
              Fast, secure and trusted authentication
            </p>

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Already do not have an account?{" "}
                <Link
                  href="/signup"
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline underline-offset-2 transition"
                >
                  Register
                </Link>
              </p>
            </div>
          </div>
        </Surface>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
          By signing In, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
