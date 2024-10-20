"use client";

import LoadingButton from "@/components/LoadingButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateSchema, UpdateType } from "@/types/auth";
import swal from "sweetalert";
import { ErrorMsg } from "@/components/ErrorMsg";
import { useRouter } from "next/navigation";

const AccountForm = ({
  username,
  email,
}: {
  username: string;
  email: string;
}) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<UpdateType>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      email,
      username,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    if (!updateSchema.safeParse(data).success) {
      swal({
        title: "invalid data !!",
        icon: "error",
        buttons: "okay",
      });
    }

    if (data.email === email && data.username === username) {
      swal({
        title: "you need to change the default info to update your account!!",
        icon: "error",
        buttons: "okay",
      });
    }

    const res = await fetch("/api/user/account", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.status === 400) {
      swal({
        title: "invlaid Data please verify the required fields",
        icon: "error",
        buttons: "okay",
      });
    }

    if (res.status === 401) {
      swal({
        title: "you need to signin before updating your account info",
        icon: "error",
        buttons: "okay",
      });
    }

    if (res.ok) {
      const res = await fetch("/api/signout", {
        method: "POST",
      });

      swal({
        title: "your account successfully updated now you can signin",
        icon: "success",
        buttons: "okay",
      }).then((result) => {
        router.replace("/signin");
        router.refresh();
      });
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" action="">
      <div>
        <Label>
          Username
          <Input {...register("username")} />
        </Label>
        {errors.username && (
          <ErrorMsg msg={errors.username.message as string} />
        )}
      </div>

      <div>
        <Label>
          Email
          <Input {...register("email")} />
        </Label>
        {errors.email && <ErrorMsg msg={errors.email.message as string} />}
      </div>

      <LoadingButton isPending={isSubmitting} label="Update account" />
    </form>
  );
};

export default AccountForm;
