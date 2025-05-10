import {
  AlreadyLoggedIn,
  LoginForm,
  SignedIn,
  SignedOut,
} from "@/components/auth";
import { ThemeToggle } from "@/components/theme";

export default async function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <ThemeToggle />

      <div className="w-full max-w-sm">
        {<SignedIn>{(user) => <AlreadyLoggedIn user={user} />}</SignedIn>}
        {
          <SignedOut>
            <LoginForm />
          </SignedOut>
        }
      </div>
    </div>
  );
}
