import Script from "next/script";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {}, []);

  const initGoogleSignIn = () => {
    google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: handleCredentialResponse,
    });
    google.accounts.id.renderButton(
      document.getElementById("googleSignInBtnWrapper")!,
      { type: "standard", shape: "pill" },
    );
  };

  const handleCredentialResponse = async (
    credentials: google.accounts.id.CredentialResponse,
  ) => {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken: credentials.credential }),
    });
    const data = await response.json();

    console.log(data);
  };

  return (
    <>
      <div id="googleSignInBtnWrapper" style={{ maxWidth: 240 }}></div>
      <Script
        src="https://accounts.google.com/gsi/client"
        onReady={initGoogleSignIn}
      />
    </>
  );
}
