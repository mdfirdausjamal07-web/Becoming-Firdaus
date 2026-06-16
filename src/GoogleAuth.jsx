import { useState, useEffect } from "react";

const FB_KEY = 'AIzaSyDU6kehstWmNktdHSI04iv8wHwci-JcWB8';

const getFirebase = async () => {
  const { initializeApp, getApps } = await import("firebase/app");
  const apps = getApps();
  const app = apps.find(a => a.name === 'ga') || initializeApp({
    apiKey: FB_KEY,
    authDomain: "becoming-firdaus-1.firebaseapp.com",
    projectId: "becoming-firdaus-1",
  }, "ga");
  const { getAuth, GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
  return { auth: getAuth(app), GoogleAuthProvider, signInWithPopup };
};

export default function GoogleAuth({ onSignedIn }) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('login');
  const [name, setName] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const handleGoogle = async () => {
    setLoading(true);
    setError('');
    try {
      const { auth, GoogleAuthProvider, signInWithPopup } = await getFirebase();
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      localStorage.setItem('bf_google_uid', result.user.uid);
      setUser(result.user);
      setStep('name');
    } catch (e) {
      if (e.code !== 'auth/popup-closed-by-user') {
        setError(e.message);
      }
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
  const CARD = { background:'#0A0A1E', border:'1px solid #22224A', borderRadius:16, padding:24, width:'100%', maxWidth:360 };
  const BTN = (col, disabled) => ({
    width:'100%', background: disabled ? '#111122' : col+'22',
    border:'1px solid '+(disabled ? '#222244' : col+'55'),
    color: disabled ? '#333366' : col,
    borderRadius:10, padding:'13px', fontSize:12,
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily:'Orbitron,monospace', letterSpacing:2, marginTop:12
  });
  const INP = {
    background:'#0E0E28', border:'1px solid #28285A',
    borderRadius:8, padding:'12px', color:'#F0F0FF',
    fontSize:14, outline:'none', width:'100%',
    fontFamily:'Inter,sans-serif', marginTop:8,
    boxSizing:'border-box'
  };

  const WRAP = {
    background: BG,
    height: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    boxSizing: 'border-box',
    overflow: 'hidden',
    position: 'fixed',
    top: 0, left: 0,
  };

  if (step === 'name') return (
    <div style={WRAP}>
      <div style={{ ...CARD, textAlign:'center' }}>
        <div style={{ fontSize:36, marginBottom:10 }}>⚔️</div>
        <div style={{ fontFamily:'Orbitron,monospace', fontSize:16, color:'#33DDFF', marginBottom:6 }}>
          WARRIOR IDENTIFIED
        </div>
        <div style={{ color:'#5050A0', fontSize:12, marginBottom:20, lineHeight:1.6 }}>
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
        <button
          onClick={handleNameSubmit}
          disabled={!name.trim()}
          style={BTN('#33DDFF', !name.trim())}
        >
          BEGIN THE WAR →
        </button>
      </div>
    </div>
  );

  return (
    <div style={WRAP}>
      <div style={{ textAlign:'center', marginBottom:32 }}>
        <div style={{ fontFamily:'Orbitron,monospace', fontSize:8, color:'#252550', letterSpacing:4, marginBottom:8 }}>
          SYSTEM INITIALIZING
        </div>
        <div style={{ fontFamily:'Orbitron,monospace', fontSize:24, fontWeight:900, color:'#33DDFF', letterSpacing:2, marginBottom:6 }}>
          BECOMING FIRDAUS
        </div>
        <div style={{ color:'#404080', fontSize:12, letterSpacing:1 }}>
          The Inner War Protocol
        </div>
      </div>

      <div style={CARD}>
        <div style={{ fontFamily:'Orbitron,monospace', fontSize:8, color:'#252550', letterSpacing:3, marginBottom:12 }}>
          AUTHENTICATION REQUIRED
        </div>
        <div style={{ color:'#606090', fontSize:12, lineHeight:1.7, marginBottom:4 }}>
          Sign in to access your war records across any device.
        </div>
        {error ? (
          <div style={{ color:'#FF6666', fontSize:11, marginTop:8, padding:'8px', background:'#FF000011', borderRadius:6 }}>
            {error}
          </div>
        ) : null}
        <button onClick={handleGoogle} disabled={loading} style={BTN('#33DDFF', loading)}>
          {loading ? 'AUTHENTICATING…' : '🔵  SIGN IN WITH GOOGLE'}
        </button>
      </div>

      <div style={{ textAlign:'center', marginTop:20, color:'#1A1A35', fontSize:10, fontFamily:'Orbitron,monospace', letterSpacing:1 }}>
        NEET 2027 · THE WAR NEVER ENDS
      </div>
    </div>
  );
}
