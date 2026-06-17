import { useState } from "react";
import { fetchNameFromFirebase, saveNameToFirebase } from "./GoogleAuth";

export default function SettingsPanel() {
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);

  const uid = localStorage.getItem('bf_google_uid');
  const token = localStorage.getItem('bf_google_token');
  const currentName = localStorage.getItem('bf_user_name') || 'Warrior';

  const handleSaveName = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    await saveNameToFirebase(uid, token, newName.trim());
    localStorage.setItem('bf_user_name', newName.trim());
    setSaving(false);
    setEditingName(false);
    window.location.reload();
  };

  const handleSignOut = () => {
    localStorage.clear();
    window.location.reload();
  };

  const CARD = { background:'#0A0A1E', border:'1px solid #22224A', borderRadius:12, padding:16, marginBottom:12 };
  const BTN = (col) => ({ background:col+'22', border:'1px solid '+col+'55', color:col, borderRadius:8, padding:'10px 16px', fontSize:11, cursor:'pointer', fontFamily:'Orbitron,monospace', letterSpacing:1 });
  const INP = { background:'#0E0E28', border:'1px solid #28285A', borderRadius:8, padding:'10px', color:'#F0F0FF', fontSize:13, outline:'none', width:'100%', fontFamily:'Inter,sans-serif', boxSizing:'border-box', marginBottom:10 };

  return (
    <div>
      <div style={CARD}>
        <div style={{ fontFamily:'Orbitron,monospace', fontSize:9, color:'#7070B0', letterSpacing:3, marginBottom:12 }}>EDIT NAME</div>
        {editingName ? (
          <div>
            <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder={currentName} style={INP} autoFocus />
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={handleSaveName} disabled={saving} style={{ ...BTN('#33DDFF'), flex:1 }}>{saving?'SAVING…':'SAVE'}</button>
              <button onClick={()=>setEditingName(false)} style={{ ...BTN('#505090'), flex:1 }}>CANCEL</button>
            </div>
          </div>
        ) : (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <span style={{ fontSize:15, color:'#F0F0FF' }}>{currentName}</span>
            <button onClick={()=>{setNewName('');setEditingName(true);}} style={BTN('#33DDFF')}>EDIT</button>
          </div>
        )}
      </div>

      <div style={CARD}>
        <div style={{ fontFamily:'Orbitron,monospace', fontSize:9, color:'#7070B0', letterSpacing:3, marginBottom:12 }}>ACCOUNT</div>
        <div style={{ fontSize:12, color:'#606090', marginBottom:12 }}>
          UID: <span style={{ color:'#303060', fontSize:10 }}>{uid?.slice(0,16)}...</span>
        </div>
        <button onClick={handleSignOut} style={{ ...BTN('#FF6666'), width:'100%' }}>
          🚪 SIGN OUT
        </button>
      </div>

      <div style={{ ...CARD, textAlign:'center' }}>
        <div style={{ fontFamily:'Orbitron,monospace', fontSize:9, color:'#7070B0', letterSpacing:3, marginBottom:8 }}>BECOMING FIRDAUS</div>
        <div style={{ fontSize:11, color:'#303060' }}>Inner War Protocol · NEET 2027</div>
        <div style={{ fontSize:10, color:'#202040', marginTop:4 }}>v1.0 · Personal Edition</div>
      </div>
    </div>
  );
}
