"use server";
import { SignIn, SignOut } from "@/components/auth-components";
export default async function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 w-full">
      <p className="menu-label">Auth</p>
      <SignIn provider="azure-ad" className="mb-4">
        Sign In with Azure AD
      </SignIn>
      <SignIn provider="google" className="mb-4">
        Sign In with Google
      </SignIn>
      <SignOut className="mb-4">Sign Out</SignOut>
    </div>
  );
}
