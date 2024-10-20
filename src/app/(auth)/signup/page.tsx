"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Register, registerSchema } from "@/types/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import LoadingButton from "@/components/LoadingButton";
import swal from "sweetalert";
import { useRouter } from "next/navigation";
import { ErrorMsg } from "@/components/ErrorMsg";
import Link from "next/link";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const route = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Register>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.status === 400) {
        setError("invalied data please check the inputs");
      }

      if (res.status === 409) {
        setError(
          "username or email already taken please use another email or username"
        );
      }

      if (res.status === 500) {
        setError("An unexpected error occurred.");
      }

      if (res.ok) {
        setError(null);
        swal({
          icon: "success",
          title:
            "Registration successful! You can now log in with your new account.",
          button: "okey",
        });

        reset();

        route.replace("/signin");
      }
    } catch (error) {
      if (error instanceof Error) console.log(error.message);
    }
  });

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="p-4 border rounded w-[400px]">
        <h1 className="font-semibold text-4xl text-center my-2">Sign up</h1>
        <form className="mt-5 space-y-4" onSubmit={onSubmit}>
          <div>
            <Label htmlFor="email">Username</Label>
            <Input
              placeholder="username"
              type="text"
              {...register("username")}
            />
            {errors.username && <ErrorMsg msg={errors.username.message!} />}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              placeholder="email"
              type="email"
              className=""
              {...register("email")}
            />
            {errors.email && <ErrorMsg msg={errors.email.message!} />}
          </div>

          <div>
            <Label>Password</Label>
            <div className="relative">
              <Input
                placeholder="password"
                type={showPassword ? "text" : "password"}
                className="pe-10"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transform text-muted-foreground">
                {showPassword ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </button>
            </div>
            {errors.password && <ErrorMsg msg={errors.password.message!} />}
          </div>

          {error && (
            <div className="my-2">
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}

          <LoadingButton label="Signup" isPending={isSubmitting} />

          <div className="my-5 text-sm text-center">
            Already have an acount ?
            <Link className="hover:underline" href="/signin">
              Signup
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
