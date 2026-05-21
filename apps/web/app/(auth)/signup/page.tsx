import * as React from "react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "~/components/ui/input-group";
import { HugeiconsIcon } from "@hugeicons/react";
import { LockKeyIcon, MailLove01Icon, UserCircleIcon } from "@hugeicons/core-free-icons";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import LogInWithGithub from "~/components/features/auth/LoginWithGithub";
import LogInWithGoogle from "~/components/features/auth/LogInWithGoogle";
const page = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <h1 className="text-4xl font-instrumental-serif leading-tight">Create a new account</h1>

          <p className="text-muted-foreground mt-2 text-sm ">
            Build elegant forms, collect responses, and customize every detail.
          </p>
        </div>
        <div className="mb-4 flex-col flex gap-3">
          <LogInWithGoogle />
          <LogInWithGithub />
        </div>
        <div className="gap-4 flex flex-col">
          <div className="gap-2 flex flex-col">
            <Label htmlFor="name">Full Name</Label>
            <InputGroup>
              <InputGroupAddon>
                <HugeiconsIcon icon={UserCircleIcon} />
              </InputGroupAddon>
              <InputGroupInput id="name" type="text" placeholder="Enter your full name" />
            </InputGroup>
          </div>
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
            Sign Up
          </Button>
          <Link href="/login" className="text-primary hover:underline mx-auto">
            <Button variant="link" animation="none" className="text-sm text-muted-foreground">
              Already have an account? Log in
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
