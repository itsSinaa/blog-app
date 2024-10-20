"use client";

import { ErrorMsg } from "@/components/ErrorMsg";
import LoadingButton from "@/components/LoadingButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { profileSchema, ProfileType } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import swal from "sweetalert";

const ProfileForm = ({
  displayName,
  bio,
}: {
  displayName: string;
  bio: string;
}) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProfileType>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      bio,
      displayName,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log(data);

      if (!profileSchema.safeParse(data).success) {
        swal({
          title: "invalid data !!",
          icon: "error",
          buttons: "okay",
        });
      }

      const formData = new FormData();

      formData.append("displayName", data.displayName);
      formData.append("bio", data.bio);
      formData.append("profile", data.profile);

      const res = await fetch("/api/user/profile", {
        method: "PUT",
        body: formData,
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
        swal({
          title: "your  profile updated successfully",
          icon: "success",
          buttons: "nice",
        });

        router.refresh();
      }
    } catch (error) {
      swal({
        title: "internal  server error !!!",
        icon: "error",
        buttons: "okay",
      });
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" action="">
      <div>
        <Label>
          Display name
          <Input
            {...register("displayName")}
            placeholder="your display name ..."
          />
        </Label>
        {errors.displayName && <ErrorMsg msg={errors.displayName.message!} />}
      </div>

      <div>
        <Label>
          Bio
          <Textarea {...register("bio")} placeholder="your bio ..." />
        </Label>
        {errors.bio && <ErrorMsg msg={errors.bio.message!} />}
      </div>

      <div>
        <Controller
          name="profile"
          control={control}
          render={({ field }) => (
            <div>
              <label htmlFor="profile">
                <span className="inline-flex cursor-pointer justify-center whitespace-nowrap gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
                  <Upload className="size-5" />
                  Change profile
                </span>
              </label>
              <input
                id="profile"
                type="file"
                className="hidden"
                onChange={(e) => field.onChange(e.target.files?.[0])}
              />
            </div>
          )}
        />
        {errors.profile && <ErrorMsg msg={errors.profile.message!} />}
      </div>

      <LoadingButton isPending={isSubmitting} label="Update account" />
    </form>
  );
};

export default ProfileForm;
