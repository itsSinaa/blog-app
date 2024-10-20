import LoadingButton from "@/components/LoadingButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getUserID, isAuthenticated } from "@/utils/auth";
import { Upload } from "lucide-react";
import React from "react";
import AccountForm from "./AccountForm";
import ProfileForm from "./ProfileForm";
import prisma from "@/lib/client";

const AccountPage = async () => {
  const userPayload = await isAuthenticated();
  const userID = await getUserID();

  const userProfile = await prisma.profile.findFirst({
    where: { userID: userID?.id },
    select: {
      displayname: true,
      bio: true,
    },
  });

  return (
    <div className="w-[60%] my-4">
      <div>
        <div className="space-y-3">
          <h2 className="text-2xl">Account Info</h2>
          <AccountForm
            email={userPayload.email}
            username={userPayload.username}
          />
        </div>
        <div className="w-full h-px bg-muted my-9"></div>
        <div className="space-y-3">
          <h2 className="text-2xl">Account Profile</h2>
          <ProfileForm
            displayName={userProfile?.displayname || ""}
            bio={userProfile?.bio || ""}
          />
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
