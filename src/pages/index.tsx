import Script from "next/script";
import { useEffect, useRef } from "react";

export default function Home() {
  useEffect(() => {
    google.accounts.id.initialize({
      client_id:
        "679975214581-ibtp5leaap1qgcmdvg5flb8aop4g73jh.apps.googleusercontent.com",
      callback: handleCredentialResponse,
    });
    google.accounts.id.renderButton(
      document.getElementById("googleSignInBtnWrapper")!,
      { type: "standard", shape: "pill" },
    );
  }, []);

  const handleCredentialResponse = (
    response: google.accounts.id.CredentialResponse,
  ) => {
    console.log(response);
  };

  return (
    <>
      <div id="googleSignInBtnWrapper" style={{maxWidth: 240}}></div>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="beforeInteractive"
      />
    </>
  );
}
