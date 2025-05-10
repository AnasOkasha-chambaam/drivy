import { SaveIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { GithubSignInButton } from "../buttons";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <Link
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md">
                <SaveIcon className="size-6" />
              </div>
              <span className="sr-only">Drivy.</span>
            </Link>
            <h1 className="text-xl font-bold">Welcome to Drivy.</h1>
            {/* <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline underline-offset-4">
                Sign up
              </Link>
            </div> */}
          </div>
        </div>
      </form>
      <div className="">
        <GithubSignInButton />
      </div>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary  ">
        By clicking continue, you agree to our{" "}
        <Link href="#">Terms of Service</Link> and{" "}
        <Link href="#">Privacy Policy</Link>.
      </div>
    </div>
  );
}
