f = open('src/App.jsx', 'r')
code = f.read()
f.close()

old_start = 'function buildShareCard(player, habits) {'
old_end = "  return canvas.toDataURL('image/png');\n}"

start_i = code.index(old_start)
end_i = code.index(old_end) + len(old_end)

new_fn = '''function buildShareCard(player, habits) {
  const SCALE=2.5, BW=420, QH=36, HDR=196, FTR=76;
  const H = HDR + habits.length*QH + FTR;
  const canvas = document.createElement('canvas');
  canvas.width = BW*SCALE; canvas.height = H*SCALE;
  const ctx = canvas.getContext('2d');
  ctx.scale(SCALE, SCALE);
  const rank = getRank(player.totalXP), nxt = getNextRank(player.totalXP);
  const done = habits.filter(h => h.completed).length;
  const pct  = habits.length > 0 ? Math.round((done/habits.length)*100) : 0;
  const xpPct = getXPPct(player.totalXP);

  ctx.fillStyle = '#04040C'; ctx.fillRect(0,0,BW,H);
  for (let i=4; i>=1; i--) {
    ctx.strokeStyle = rank.color + Math.floor(12+i*13).toString(16).padStart(2,'0');
    ctx.lineWidth = i*2; ctx.strokeRect(8,8,BW-16,H-16);
  }

  ctx.textAlign = 'center';
  ctx.fillStyle = '#00D4FF'; ctx.font = 'bold 28px "Courier New",monospace';
  ctx.fillText('BECOMING FIRDAUS', BW/2, 44);
  ctx.fillStyle = '#303070'; ctx.font = '9px "Courier New",monospace';
  ctx.fillText('INNER WAR PROTOCOL  -  NEET 2027', BW/2, 62);
  ctx.fillStyle = '#1E1E50'; ctx.font = '8px "Courier New",monospace';
  ctx.fillText(todayStr(), BW/2, 78);

  ctx.strokeStyle = '#202045'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(20,90); ctx.lineTo(BW-20,90); ctx.stroke();

  let y = 108;
  ctx.beginPath(); ctx.arc(54,y+20,20,0,Math.PI*2);
  ctx.strokeStyle = rank.color; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = rank.color+"20"; ctx.fill();
  ctx.fillStyle = rank.color; ctx.font = "bold 16px 'Courier New',monospace"; ctx.textAlign = "center";
  ctx.fillText(rank.name[0], 54, y+26);

  ctx.textAlign = "left";
  ctx.fillStyle = "#F0F0FF"; ctx.font = "bold 14px 'Courier New',monospace";
  ctx.fillText("Md Firdaus Jamal", 86, y+14);
  ctx.fillStyle = rank.color; ctx.font = "10px 'Courier New',monospace";
  ctx.fillText(rank.name+"-Rank Warrior", 86, y+30);

  y += 50;
  const statsRow = [["Completion",pct+"%"],["XP",player.totalXP.toLocaleString()],["Streak",player.streak+" days"]];
  statsRow.forEach(([l,v],i) => {
    const x = 20 + i*(BW-40)/3;
    ctx.fillStyle = "#0D0D25"; ctx.fillRect(x, y, (BW-40)/3-6, 34);
    ctx.strokeStyle = "#1E1E45"; ctx.lineWidth = 1; ctx.strokeRect(x, y, (BW-40)/3-6, 34);
    ctx.fillStyle = "#5050A0"; ctx.font = "8px 'Courier New',monospace"; ctx.textAlign = "left";
    ctx.fillText(l, x+8, y+13);
    ctx.fillStyle = "#00D4FF"; ctx.font = "bold 13px 'Courier New',monospace";
    ctx.fillText(v, x+8, y+27);
  });

  y += 46;
  ctx.fillStyle = "#141432"; ctx.beginPath(); ctx.roundRect(20,y,BW-40,5,3); ctx.fill();
  if (xpPct > 0) {
    const g = ctx.createLinearGradient(20,0,BW-40,0);
    g.addColorStop(0, rank.color+"50"); g.addColorStop(1, rank.color);
    ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(20,y,(BW-40)*(xpPct/100),5,3); ctx.fill();
  }

  y += 16; ctx.strokeStyle = "#202045"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(20,y); ctx.lineTo(BW-20,y); ctx.stroke();
  y += 14;

  ctx.fillStyle = "#5050A0"; ctx.font = "bold 9px 'Courier New',monospace"; ctx.textAlign = "left";
  ctx.fillText("DAILY QUESTS", 20, y);
  ctx.textAlign = "right"; ctx.fillStyle = done===habits.length?"#33FF99":"#33DDFF";
  ctx.fillText(done+"/"+habits.length, BW-20, y);
  y += 10;

  habits.forEach(h => {
    y += 8;
    const col = h.completed ? "#33FF99" : "#FF6666";
    ctx.strokeStyle = col+"90"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.roundRect(22,y-7,14,14,3); ctx.stroke();
    if (h.completed) { ctx.fillStyle = col+"25"; ctx.fill(); }
    ctx.fillStyle = col; ctx.font = "bold 10px 'Courier New',monospace"; ctx.textAlign = "center";
    ctx.fillText(h.completed?"v":"x", 29, y+3);
    ctx.textAlign = "left";
    ctx.fillStyle = h.completed ? "#E0E0FF" : "#9090C0";
    ctx.font = "11px 'Courier New',monospace";
    let nm = h.icon+" "+h.name;
    while (ctx.measureText(nm).width > BW-95 && nm.length > 8) nm = nm.slice(0,-1);
    ctx.fillText(nm, 44, y+3);
    ctx.textAlign = "right"; ctx.fillStyle = h.completed?SC[h.stat]:"#404070";
    ctx.font = "9px 'Courier New',monospace"; ctx.fillText("+"+h.xp, BW-20, y+3);
    y += QH-8;
  });

  y += 14; ctx.strokeStyle = "#202045"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(20,y); ctx.lineTo(BW-20,y); ctx.stroke();
  y += 16; ctx.fillStyle = "#3030A0"; ctx.font = "9px 'Courier New',monospace"; ctx.textAlign = "center";
  ctx.fillText("#BecomingFirdaus  #InnerWar  #NEET2027", BW/2, y);
  y += 14; ctx.fillStyle = "#181835"; ctx.font = "8px 'Courier New',monospace";
  ctx.fillText("becoming-firdaus.vercel.app", BW/2, y);
  return canvas.toDataURL("image/png");
}'''

code = code[:start_i] + new_fn + code[end_i:]

f = open('src/App.jsx', 'w', encoding='utf-8')
f.write(code)
f.close()
print('Done!')
