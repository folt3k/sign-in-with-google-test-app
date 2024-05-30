import Script from "next/script";

export default function Home() {
  // inicjujemy klienta Sign In With Google
  const initGoogleSignIn = () => {
    google.accounts.id.initialize({
      // dodajemy wygnenerowany wcześniej Client ID z Google API
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      // callback wywoływany po zalogowaniu się przez użytkownika
      callback: handleCredentialResponse,
    });
    // renderujemy przycisk logowania
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

  // ładujemy skrypt i po jego wczytaniu inicjujemy klienta Sign In With Google
  return (
    <>
      <div id="googleSignInBtnWrapper" />
      <Script
        src="https://accounts.google.com/gsi/client"
        onReady={initGoogleSignIn}
      />
    </>
  );
}
