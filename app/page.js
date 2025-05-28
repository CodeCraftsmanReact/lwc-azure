"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [userInfo, setUserInfo] = useState();
  const providers = ["twitter", "github", "aad"];
  const redirect = window.location.pathname;
  useEffect(() => {
    (async () => {
      setUserInfo(await getUserInfo());
    })();
  }, []);
  async function getUserInfo() {
    try {
      const response = await fetch("/.auth/me");
      const payload = await response.json();
      const { clientPrincipal } = payload;
      return clientPrincipal;
    } catch (error) {
      console.log("Error fetching user info:", error);
      return undefined;
    }
  }
  console.log(userInfo);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 w-full">
      <p classname="menu-label">Auth</p>
      <div>
        {!userInfo &&
          providers.map((provider) => (
            <a
              key={provider}
              href={`/.auth/login/${provider}?post_login_redirect_uri=${redirect}`}
            >
              {provider}
              <br />
            </a>
          ))}
        {userInfo && (
          <div className="flex flex-col items-center">
            <a
              href={`/.auth/logout?post_logout_redirect_uri=${redirect}`}
              className="text-blue-500 hover:underline"
            >
              Logout
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
