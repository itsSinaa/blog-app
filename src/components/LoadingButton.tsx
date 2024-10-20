import React from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

const LoadingButton = ({
  isPending,
  label,
}: {
  isPending: boolean;
  label: string;
}) => {
  return (
    <Button type="submit" disabled={isPending}>
      {isPending ? (
        <>
          <Loader2 className="animate-spin mr-2" /> {label}...
        </>
      ) : (
        label
      )}
    </Button>
  );
};

export default LoadingButton;
