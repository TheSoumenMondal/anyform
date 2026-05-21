import * as React from "react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "~/components/ui/input-group";
import { HugeiconsIcon } from "@hugeicons/react";
import { LockKeyIcon, MailLove01Icon } from "@hugeicons/core-free-icons";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import LogInWithGoogle from "~/components/features/auth/LogInWithGoogle";
import LogInWithGithub from "~/components/features/auth/LoginWithGithub";
const page = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <h1 className="text-4xl font-instrumental-serif leading-tight">Login to your account</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Build elegant forms, collect responses, and customize every detail.
          </p>
        </div>
        <div className="mb-4 flex flex-col gap-3">
          <LogInWithGoogle />
          <LogInWithGithub />
        </div>
        <div className="gap-4 flex flex-col">
          <div className="gap-2 flex flex-col">
            <Label htmlFor="email">Email</Label>
            <InputGroup>
              <InputGroupAddon>
                <HugeiconsIcon icon={MailLove01Icon} />
              </InputGroupAddon>
              <InputGroupInput id="email" type="email" placeholder="Enter your email" />
            </InputGroup>
          </div>
          <div className="gap-2 flex flex-col">
            <Label htmlFor="password">Password</Label>
            <InputGroup>
              <InputGroupAddon>
                <HugeiconsIcon icon={LockKeyIcon} />
              </InputGroupAddon>
              <InputGroupInput id="password" type="password" placeholder="Enter your password" />
            </InputGroup>
          </div>
          <Button size="lg" variant="info" animation="none">
            Login
          </Button>
          <Link href="/signup" className="text-primary hover:underline mx-auto">
            <Button variant="link" animation="none" className="text-sm text-muted-foreground">
              Don&apos;t have an account? Sign up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
