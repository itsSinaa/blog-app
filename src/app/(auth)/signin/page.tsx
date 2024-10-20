"use client";

import { ErrorMsg } from "@/components/ErrorMsg";
import LoadingButton from "@/components/LoadingButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Signin as SigninType, signinSchema } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import swal from "sweetalert";

const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    reset,
    formState: { isSubmitting, errors },
    handleSubmit,
  } = useForm<SigninType>({
    resolver: zodResolver(signinSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      usernameOrEmail: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    const res = await fetch("/api/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.status === 400) {
      setError("data is invalid please fill  the required fields");
    }

    if (res.status === 401) {
      setError("user info  or password is incorrect !");
    }

    if (res.ok) {
      setError(null);

      swal({
        icon: "success",
        title: "Logged in successfully!!",
        buttons: "nice !",
      });

      reset();

      router.replace("/");
      router.refresh();
    }
  });

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div className="w-[400px] border p-4 rounded">
        <h1 className="font-semibold text-4xl text-center my-2">Login</h1>
        <h2 className="text-center text-xl my-1">welcome back!</h2>
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="space-y-0.5">
            <Label htmlFor="provider">Username or Email</Label>
            <Input
              id="provider"
              {...register("usernameOrEmail")}
              type="text"
              placeholder="username | email"
            />
            {errors.usernameOrEmail && (
              <ErrorMsg msg={errors.usernameOrEmail.message!} />
            )}
          </div>
          <div className="space-y-0.5">
            <Label htmlFor="pass">Password</Label>
            <div className="relative">
              <Input
                id="pass"
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
            Don't have acount ?
            <Link className="hover:underline" href="/signup">
              Signup
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin;
