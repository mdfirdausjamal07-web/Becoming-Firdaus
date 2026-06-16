import { useState } from "react";

const FB_KEY = 'AIzaSyDU6kehstWmNktdHSI04iv8wHwci-JcWB8';

export default function GoogleAuth({ onSignedIn }) {
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const { initializeApp } = await import("firebase/app");
      const { getAuth, GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
      const app = initializeApp({
        apiKey: FB_KEY,
        authDomain: "becoming-firdaus-1.firebaseapp.com",
        projectId: "becoming-firdaus-1",
      }, "google-auth");
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      onSignedIn(result.user);
    } catch (e) {
      alert("Google sign-in failed: " + e.message);
    }
    setLoading(false);
  };

  return (
    <button onClick={handleGoogle} disabled={loading} style={{
      width: '100%',
      background: '#ffffff10',
      border: '1px solid #ffffff30',
      borderRadius: 10,
      padding: '12px',
      color: '#fff',
      fontSize: 14,
      cursor: loading ? 'not-allowed' : 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      fontFamily: 'Inter, sans-serif',
      marginTop: 10,
    }}>
      <span style={{ fontSize: 18 }}>🔵</span>
      {loading ? 'Signing in...' : 'Sign in with Google'}
    </button>
  );
}
