"use client";

import { signIn, signOut } from "next-auth/react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 w-full">
      <h1> Welcome!</h1>
      <button onClick={() => signIn("google")} className="mb-4">
        Sign In with Google
      </button>
      <button onClick={() => signIn("azure-ad-b2c")} className="mb-4">
        Sign in with Azure
      </button>
      <button onClick={() => signOut()} className="mb-4">
        Sign Out
      </button>
    </div>
  );
}
