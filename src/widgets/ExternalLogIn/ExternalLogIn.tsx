import type { FC } from "react";
import { Button } from "@/shared/ui/Button/Button";
import { Separator } from "@/shared/ui/Separator/Separator";
import { AppleIcon } from "@shared/ui/Icons/AppleIcon";
import { GoogleIcon } from "@shared/ui/Icons/GoogleIcon";

export const ExternalLogIn: FC = () => {
  return (
    <>
      <Button variant="signup" leftIcon={<GoogleIcon />}>
        Продолжить с Google
      </Button>
      <Button variant="signup" leftIcon={<AppleIcon />}>
        Продолжить с Apple
      </Button>
      <Separator />
    </>
  );
};
