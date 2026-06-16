import { useState } from "react";

const FB_KEY = 'AIzaSyDU6kehstWmNktdHSI04iv8wHwci-JcWB8';

export default function GoogleAuth({ onSignedIn }) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('login');
  const [name, setName] = useState('');
  const [user, setUser] = useState(null);

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const { initializeApp, getApps } = await import("firebase/app");
      const { getAuth, GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
      const apps = getApps();
      const app = apps.find(a => a.name === 'google-auth') ||
        initializeApp({
          apiKey: FB_KEY,
          authDomain: "becoming-firdaus-1.firebaseapp.com",
          projectId: "becoming-firdaus-1",
        }, "google-auth");
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      localStorage.setItem('bf_google_uid', result.user.uid);
      setUser(result.user);
      setStep('name');
    } catch (e) {
      alert("Google sign-in failed: " + e.message);
    }
    setLoading(false);
  };

  const handleNameSubmit = () => {
    if (!name.trim()) return;
    localStorage.setItem('bf_user_name', name.trim());
    localStorage.setItem('bf_signed_in', 'true');
    onSignedIn(user, name.trim());
  };

  const BG = '#04040C';
  const CARD = { background:'#0A0A1E', border:'1px solid #22224A', borderRadius:16, padding:24 };
  const BTN = (col) => ({ width:'100%', background:col+'22', border:'1px solid '+col+'55', color:col, borderRadius:10, padding:'13px', fontSize:13, cursor:'pointer', fontFamily:'Orbitron,monospace', letterSpacing:2, marginTop:12 });
  const INP = { background:'#0E0E28', border:'1px solid #28285A', borderRadius:8, padding:'12px', color:'#F0F0FF', fontSize:14, outline:'none', width:'100%', fontFamily:'Inter,sans-serif', marginTop:8 };

  if (step === 'name') return (
    <div style={{ background:BG, minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ ...CARD, width:'100%', maxWidth:380, textAlign:'center' }}>
        <div style={{ fontSize:40, marginBottom:12 }}>⚔️</div>
        <div style={{ fontFamily:'Orbitron,monospace', fontSize:18, color:'#33DDFF', marginBottom:6 }}>WARRIOR IDENTIFIED</div>
        <div style={{ color:'#5050A0', fontSize:13, marginBottom:24, lineHeight:1.6 }}>
          Welcome. What shall we call you?
        </div>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key==='Enter' && handleNameSubmit()}
          placeholder="Enter your name…"
          style={INP}
          autoFocus
        />
        <button onClick={handleNameSubmit} disabled={!name.trim()} style={BTN('#33DDFF')}>
          BEGIN THE WAR →
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ background:BG, minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ width:'100%', maxWidth:380 }}>
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ fontFamily:'Orbitron,monospace', fontSize:9, color:'#303065', letterSpacing:4, marginBottom:8 }}>SYSTEM INITIALIZING</div>
          <div style={{ fontFamily:'Orbitron,monospace', fontSize:26, fontWeight:900, color:'#33DDFF', letterSpacing:2, marginBottom:8 }}>BECOMING FIRDAUS</div>
          <div style={{ color:'#5050A0', fontSize:13, letterSpacing:1 }}>The Inner War Protocol</div>
        </div>

        <div style={CARD}>
          <div style={{ fontFamily:'Orbitron,monospace', fontSize:9, color:'#303065', letterSpacing:3, marginBottom:16 }}>AUTHENTICATION REQUIRED</div>
          <div style={{ color:'#7070A0', fontSize:12, lineHeight:1.7, marginBottom:20 }}>
            Your data is tied to your account. Sign in to access your war records across any device.
          </div>
          <button onClick={handleGoogle} disabled={loading} style={BTN('#33DDFF')}>
            {loading ? 'AUTHENTICATING…' : '🔵  SIGN IN WITH GOOGLE'}
          </button>
        </div>

        <div style={{ textAlign:'center', marginTop:24, color:'#252545', fontSize:11, fontFamily:'Orbitron,monospace', letterSpacing:1 }}>
          NEET 2027 · THE WAR NEVER ENDS
        </div>
      </div>
    </div>
  );
}
