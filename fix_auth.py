f = open('src/App.jsx', 'r', encoding='utf-8')
code = f.read()
f.close()

old = """const safeGet = async k => { try { const r=await fetch(`${FB_BASE}/${k}?key=${FB_KEY}`); if(!r.ok) return null; const d=await r.json(); const v=d?.fields?.value?.stringValue; return v?JSON.parse(v):null; } catch { return null; } };
const safeSet = async (k,v) => { try { await fetch(`${FB_BASE}/${k}?key=${FB_KEY}&updateMask.fieldPaths=value`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:{value:{stringValue:JSON.stringify(v)}}})}); } catch {} };"""

new = """let _tok=null,_tokExp=0,_ref=localStorage.getItem('bf_ref')||null;
const getToken=async()=>{const now=Date.now();if(_tok&&now<_tokExp-60000)return _tok;try{if(_ref){const r=await fetch('https://securetoken.googleapis.com/v1/token?key='+FB_KEY,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({grant_type:'refresh_token',refresh_token:_ref})});const d=await r.json();if(d.id_token){_tok=d.id_token;_tokExp=now+parseInt(d.expires_in)*1000;_ref=d.refresh_token;localStorage.setItem('bf_ref',_ref);return _tok;}}const r=await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='+FB_KEY,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({returnSecureToken:true})});const d=await r.json();_tok=d.idToken;_tokExp=now+parseInt(d.expiresIn)*1000;_ref=d.refreshToken;localStorage.setItem('bf_ref',_ref);return _tok;}catch{return null;}};
const safeGet = async k => { try { const t=await getToken(); const r=await fetch(`${FB_BASE}/${k}?key=${FB_KEY}`,{headers:t?{Authorization:'Bearer '+t}:{}}); if(!r.ok) return null; const d=await r.json(); const v=d?.fields?.value?.stringValue; return v?JSON.parse(v):null; } catch { return null; } };
const safeSet = async (k,v) => { try { const t=await getToken(); await fetch(`${FB_BASE}/${k}?key=${FB_KEY}&updateMask.fieldPaths=value`,{method:'PATCH',headers:{'Content-Type':'application/json',...(t?{Authorization:'Bearer '+t}:{})},body:JSON.stringify({fields:{value:{stringValue:JSON.stringify(v)}}})}); } catch {} };"""

if old in code:
    code = code.replace(old, new)
    f = open('src/App.jsx', 'w', encoding='utf-8')
    f.write(code)
    f.close()
    print('Done!')
else:
    print('String not found')
