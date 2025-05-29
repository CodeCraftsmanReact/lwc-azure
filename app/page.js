"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (session) {
      setUser(session.user);
    } else {
      setUser(null);
    }
  }, [session]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 w-full">
      <h1> Welcome!</h1>
      <div className="text-white mb-4 text-center">
        {user ? `Hello, ${user.name}` : "You are not signed in"}
        <br />
        {session ? ` (Email: ${session.user.email})` : ""}
        {user?.image ? (
          <div className="flex items-center justify-center my-2">
            <img
              src={user?.image}
              alt="User Image"
              className="rounded-full mt-2"
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center my-2">
            <span className="bg-gray-500/50 text-xs size-24 flex items-center justify-center rounded-full">
              No image
            </span>
          </div>
        )}
      </div>
      <button onClick={() => signIn("google")} className="mb-4">
        Sign In with Google
      </button>
      <button onClick={() => signIn("azure-ad")} className="mb-4">
        Sign in with Azure
      </button>
      <button onClick={() => signOut()} className="mb-4">
        Sign Out
      </button>
    </div>
  );
}
