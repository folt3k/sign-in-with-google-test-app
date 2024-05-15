import Script from "next/script";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {}, []);

  const initGoogleSignIn = () => {
    google.accounts.id.initialize({
      client_id:
        "679975214581-ibtp5leaap1qgcmdvg5flb8aop4g73jh.apps.googleusercontent.com",
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
