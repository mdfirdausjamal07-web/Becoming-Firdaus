import { useState, useEffect, useRef, useMemo } from "react";
import GoogleAuth from "./GoogleAuth";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// ── Syllabus ──────────────────────────────────────────────────────────────────
const SYLLABUS = {
  Physics:   ['Physical World & Measurement','Kinematics','Laws of Motion','Work, Energy & Power','Rotational Motion','Gravitation','Properties of Matter','Thermodynamics','Kinetic Theory of Gases','Oscillations','Waves','Electrostatics','Current Electricity','Magnetic Effects of Current','Magnetism','Electromagnetic Induction','Alternating Current','Electromagnetic Waves','Ray Optics','Wave Optics','Dual Nature of Matter','Atoms','Nuclei','Electronic Devices'],
  Chemistry: ['Basic Concepts of Chemistry','Atomic Structure','Classification of Elements','Chemical Bonding','States of Matter','Thermodynamics','Equilibrium','Redox Reactions','Hydrogen','s-Block Elements','p-Block Elements (XI)','Organic Chemistry Basics','Hydrocarbons','Environmental Chemistry','Solutions','Electrochemistry','Chemical Kinetics','Surface Chemistry','p-Block Elements (XII)','d & f Block Elements','Coordination Compounds','Haloalkanes & Haloarenes','Alcohols, Phenols & Ethers','Aldehydes & Ketones','Carboxylic Acids','Amines','Biomolecules','Polymers','Chemistry in Everyday Life'],
  Biology:   ['The Living World','Biological Classification','Plant Kingdom','Animal Kingdom','Morphology of Flowering Plants','Anatomy of Flowering Plants','Structural Organisation in Animals','Cell Structure & Function','Biomolecules','Cell Cycle & Division','Transport in Plants','Mineral Nutrition','Photosynthesis','Respiration in Plants','Plant Growth & Development','Digestion & Absorption','Breathing & Exchange of Gases','Body Fluids & Circulation','Excretory Products & Elimination','Locomotion & Movement','Neural Control & Coordination','Chemical Coordination','Reproduction in Organisms','Sexual Reproduction in Flowering Plants','Human Reproduction','Reproductive Health','Principles of Inheritance & Variation','Molecular Basis of Inheritance','Evolution','Human Health & Disease','Microbes in Human Welfare','Biotechnology: Principles & Processes','Biotechnology & its Applications','Organisms & Populations','Ecosystem','Biodiversity & Conservation','Environmental Issues'],
};

const NEET_DATE = new Date('2027-05-02T00:00:00');

const QUOTES = [
  "The war you fight every morning is the most important war of your life.",
  "You don't rise to the level of your goals. You fall to the level of your systems.",
  "The pain of discipline is nothing like the pain of regret.",
  "Every day you don't practice, someone else does.",
  "Suffer now and live the rest of your life as a champion.",
  "Hard days are the best — that's when champions are made.",
  "Do something today that your future self will thank you for.",
  "Discipline is the bridge between goals and accomplishment.",
  "Don't stop when you're tired. Stop when you're done.",
  "The inner war never ends. The question is — who wins each battle.",
  "Every missed quest is a vote for the version of you that fails.",
  "NEET 2027 is not a dream. It's a deadline.",
  "One day at a time. One quest at a time. One rank at a time.",
  "Iron sharpens iron. The inner war sharpens you.",
  "Your future patients deserve a doctor who fought for this.",
  "Firdaus means paradise. You have to earn it.",
  "The 4 AM version of you that studies while others sleep — that is the weapon.",
  "What you do in the dark will put you in the light.",
  "The body achieves what the mind believes.",
  "Be the warrior your future self needs you to be today.",
  "You are always one decision away from a completely different life.",
  "Rank up in real life before you rank up in anything else.",
  "The difference between who you are and who you want to be is what you do.",
  "Every champion was once a contender who refused to give up.",
  "Success is the sum of small efforts repeated day in and day out.",
  "Push yourself because no one else is going to do it for you.",
  "Wake up with determination. Go to bed with satisfaction.",
  "The weakest version of you chose this path. The strongest version walks it.",
  "You are not a product of your circumstances. You are a product of your decisions.",
  "Becoming is not a destination. It is the war itself.",
];

const RANKS = [
  { name:'E', minXP:0,     color:'#9E9E9E', glow:'rgba(158,158,158,0.15)' },
  { name:'D', minXP:3000,  color:'#4CAF50', glow:'rgba(76,175,80,0.18)'   },
  { name:'C', minXP:9500,  color:'#2196F3', glow:'rgba(33,150,243,0.18)'  },
  { name:'B', minXP:22000, color:'#9C27B0', glow:'rgba(156,39,176,0.18)'  },
  { name:'A', minXP:42000, color:'#FF9800', glow:'rgba(255,152,0,0.18)'   },
  { name:'S', minXP:75000, color:'#F44336', glow:'rgba(244,67,54,0.18)'   },
];

const SC = { STR:'#FF6666', INT:'#33DDFF', END:'#FFE044', AGI:'#33FF99', WIS:'#CC77FF' };
const SL = { STR:'Strength', INT:'Intelligence', END:'Endurance', AGI:'Agility', WIS:'Wisdom' };

const MOODS      = [{ emoji:'🔥',label:'Locked In',val:5 },{ emoji:'😤',label:'Grind',val:4 },{ emoji:'😊',label:'Good',val:3 },{ emoji:'😰',label:'Struggle',val:2 },{ emoji:'😔',label:'Low',val:1 }];
const SUBJECTS   = ['Physics','Chemistry','Biology'];
const SUB_C      = { Physics:'#33DDFF', Chemistry:'#FF9933', Biology:'#33FF99' };
const SUB_I      = { Physics:'⚛️', Chemistry:'🧪', Biology:'🧬' };
const REV_DAYS   = [1,3,7,14,30];
const NOTE_TAGS  = ['#study','#physical','#mindset','#win','#loss','#insight'];
const DIST_CATS  = ['Social Media','Phone','People','Food','Sleep','Random'];
const DIST_TIMES = ['Morning','Afternoon','Evening','Night'];
const QUEST_ICONS = ['🌅','💪','🏃','📚','🧠','🥊','🎥','📱','🛡️','⚔️','📖','🎯','💡','🔥','⭐','🏆','🧘','🎵','🌙','☀️','✍️','🏋️','🎨','💊','💧','🚴'];
const DEFAULT_EXERCISES = ['Push-ups','Crunches','Squats','Dumbbell Curls'];

const DEFAULT_HABITS = [
  { id:'h1', name:'Wake up at 4:00 AM',      sub:'',                                                                    xp:25, stat:'AGI', icon:'🌅' },
  { id:'h2', name:'Short Workout',            sub:'Push-ups · Crunches · Squats · Dumbbell Bicep Curls — 50 reps each', xp:25, stat:'STR', icon:'💪' },
  { id:'h3', name:'Run 2 km',                 sub:'',                                                                    xp:20, stat:'END', icon:'🏃' },
  { id:'h4', name:'Study 4+ hours',           sub:'',                                                                    xp:35, stat:'INT', icon:'📚' },
  { id:'h5', name:'Study more 4+ hours',      sub:'',                                                                    xp:35, stat:'INT', icon:'🧠' },
  { id:'h6', name:'Train Handstand + Boxing', sub:'5 min handstand · 15 min boxing',                                    xp:20, stat:'STR', icon:'🥊' },
  { id:'h7', name:'Post YT Video',            sub:'',                                                                    xp:25, stat:'WIS', icon:'🎥' },
  { id:'h8', name:'Post a Reel',              sub:'',                                                                    xp:15, stat:'WIS', icon:'📱' },
  { id:'h9', name:'No Bad Habits',            sub:'No Phone. No Reels. Nothing.',                                        xp:20, stat:'END', icon:'🛡️' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const todayStr     = () => new Date().toISOString().split('T')[0];
const yesterdayStr = () => { const d = new Date(); d.setDate(d.getDate()-1); return d.toISOString().split('T')[0]; };
const getRank      = xp => [...RANKS].reverse().find(r => xp >= r.minXP) || RANKS[0];
const getNextRank  = xp => RANKS.find(r => xp < r.minXP) || null;
const getXPPct     = xp => { const c=getRank(xp),n=getNextRank(xp); if(!n) return 100; return Math.min(((xp-c.minXP)/(n.minXP-c.minXP))*100,100); };

// ── Firebase Firestore REST API ───────────────────────────────────────────────
const FB_KEY  = 'AIzaSyDU6kehstWmNktdHSI04iv8wHwci-JcWB8';
const FB_BASE = `https://firestore.googleapis.com/v1/projects/becoming-firdaus-1/databases/(default)/documents/storage/${localStorage.getItem("bf_google_uid") || "anonymous"}`;
let _tok=null,_tokExp=0,_ref=localStorage.getItem('bf_ref')||null;
const getToken=async()=>{const now=Date.now();if(_tok&&now<_tokExp-60000)return _tok;try{if(_ref){const r=await fetch('https://securetoken.googleapis.com/v1/token?key='+FB_KEY,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({grant_type:'refresh_token',refresh_token:_ref})});const d=await r.json();if(d.id_token){_tok=d.id_token;_tokExp=now+parseInt(d.expires_in)*1000;_ref=d.refresh_token;localStorage.setItem('bf_ref',_ref);return _tok;}}const r=await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='+FB_KEY,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({returnSecureToken:true})});const d=await r.json();_tok=d.idToken;_tokExp=now+parseInt(d.expiresIn)*1000;_ref=d.refreshToken;localStorage.setItem('bf_ref',_ref);return _tok;}catch{return null;}};
const safeGet = async k => { try { const t=await getToken(); const r=await fetch(`${FB_BASE}/${k}?key=${FB_KEY}`,{headers:t?{Authorization:'Bearer '+t}:{}}); if(!r.ok) return null; const d=await r.json(); const v=d?.fields?.value?.stringValue; return v?JSON.parse(v):null; } catch { return null; } };
const safeSet = async (k,v) => { try { const t=await getToken(); await fetch(`${FB_BASE}/${k}?key=${FB_KEY}&updateMask.fieldPaths=value`,{method:'PATCH',headers:{'Content-Type':'application/json',...(t?{Authorization:'Bearer '+t}:{})},body:JSON.stringify({fields:{value:{stringValue:JSON.stringify(v)}}})}); } catch {} };

const fmtDate      = d => new Date(d+'T00:00:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});
const penaltyFor   = xp => Math.max(5, Math.floor(xp*0.4));
const getNEETDays  = () => Math.max(0, Math.ceil((NEET_DATE - new Date())/86400000));
const getDayOfWar  = first => !first ? 1 : Math.max(1, Math.ceil((new Date(todayStr()+'T00:00:00')-new Date(first+'T00:00:00'))/86400000)+1);
const addDaysTo    = (ds,n) => { const d=new Date(ds+'T00:00:00'); d.setDate(d.getDate()+n); return d.toISOString().split('T')[0]; };
const getRevNext   = r => r.lastReview ? addDaysTo(r.lastReview, REV_DAYS[Math.min(r.stage, REV_DAYS.length-1)]) : addDaysTo(r.addedDate,1);

// ── Share Card ────────────────────────────────────────────────────────────────
function buildShareCard(player, habits) {
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
  ctx.fillText("${localStorage.getItem('bf_user_name') || 'Warrior'}", 86, y+14);
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
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab,          setTab]          = useState('today');
  const [player,       setPlayer]       = useState(null);
  const [habits,       setHabits]       = useState([]);
  const [summary,      setSummary]      = useState({});
  const [histDetail,   setHistDetail]   = useState({});
  const [expandedDate, setExpandedDate] = useState(null);
  const [notif,        setNotif]        = useState(null);
  const [penWarn,      setPenWarn]      = useState(null);
  const [shareImg,     setShareImg]     = useState(null);
  const [loading,      setLoading]      = useState(true);

  const [addOpen, setAddOpen] = useState(false);
  const [editId,  setEditId]  = useState(null);
  const [nName,   setNName]   = useState('');
  const [nSub,    setNSub]    = useState('');
  const [nXP,     setNXP]     = useState(15);
  const [nStat,   setNStat]   = useState('INT');
  const [nIcon,   setNIcon]   = useState('✦');

  const [reflection,      setReflection]      = useState('');
  const [savedReflection, setSavedReflection] = useState('');

  const [distractions, setDistractions] = useState([]);
  const [distWhat,     setDistWhat]     = useState('');
  const [distCat,      setDistCat]      = useState('Social Media');
  const [distTrigger,  setDistTrigger]  = useState('');
  const [distTime,     setDistTime]     = useState('Morning');

  const [consequences, setConsequences] = useState([]);
  const [consText,     setConsText]     = useState('');
  const [consMissed,   setConsMissed]   = useState('');

  const [studyLog,    setStudyLog]    = useState([]);
  const [studySub,    setStudySub]    = useState('Physics');
  const [studyTopic,  setStudyTopic]  = useState('');
  const [studyMins,   setStudyMins]   = useState(60);
  const [revItems,    setRevItems]    = useState([]);
  const [newRevTopic, setNewRevTopic] = useState('');
  const [newRevSub,   setNewRevSub]   = useState('Physics');
  const [syllabus,    setSyllabus]    = useState({});
  const [syllabusTab, setSyllabusTab] = useState('Physics');
  const [mocks,       setMocks]       = useState([]);
  const [mockSub,     setMockSub]     = useState('Physics');
  const [mockScore,   setMockScore]   = useState('');
  const [mockMax,     setMockMax]     = useState('180');
  const [mockTopic,   setMockTopic]   = useState('');

  const [exercises,   setExercises]   = useState(DEFAULT_EXERCISES);
  const [newExercise, setNewExercise] = useState('');
  const [bodyLog,     setBodyLog]     = useState([]);
  const [todayReps,   setTodayReps]   = useState({});
  const [todayRun,    setTodayRun]    = useState({ distance:'', time:'' });
  const [todaySleep,  setTodaySleep]  = useState({ bed:'', wake:'' });

  const [notes,    setNotes]    = useState([]);
  const [noteText, setNoteText] = useState('');
  const [noteMood, setNoteMood] = useState('🔥');
  const [noteTags, setNoteTags] = useState([]);

  const [pledge,       setPledge]       = useState('');
  const [goals,        setGoals]        = useState([]);
  const [letter,       setLetter]       = useState({ text:'', revealDate:'', written:false });
  const [showLetter,   setShowLetter]   = useState(false);
  const [newGoal,      setNewGoal]      = useState('');
  const [newGoalDL,    setNewGoalDL]    = useState('');
  const [transformLog, setTransformLog] = useState([]);
  const [newTransform, setNewTransform] = useState('');

  const notifRef = useRef(null);
  const penRef   = useRef(null);

  // ── Load ─────────────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const [rawP,rawHabits,rawSum,rawNs,rawSl,rawRi,rawBl,rawMk,rawDist,rawCons,rawSyll,rawExs,rawGl,todaySnap] = await Promise.all([
          safeGet('bf_player'), safeGet('bf_habitList'), safeGet('bf_summary'),
          safeGet('bf_notes'), safeGet('bf_study'), safeGet('bf_revision'),
          safeGet('bf_body'), safeGet('bf_mocks'), safeGet('bf_distractions'),
          safeGet('bf_consequences'), safeGet('bf_syllabus'), safeGet('bf_exercises'),
          safeGet('bf_goals'), safeGet('bf_daily_'+todayStr()),
        ]);
        let p        = rawP    || { totalXP:0, stats:{STR:0,INT:0,END:0,AGI:0,WIS:0}, streak:0, bestStreak:0, lastDate:null, penaltyChecked:null, firstDate:null };
        const habitList = rawHabits || DEFAULT_HABITS;
        const sum    = rawSum  || {};
        const ns     = rawNs   || [];
        const sl     = rawSl   || [];
        const ri     = rawRi   || [];
        const bl     = rawBl   || [];
        const mk     = rawMk   || [];
        const dist   = rawDist || [];
        const cons   = rawCons || [];
        const syll   = rawSyll || {};
        const exs    = rawExs  || DEFAULT_EXERCISES;
        const gl     = rawGl   || { pledge:'', goals:[], letter:{text:'',revealDate:'',written:false}, transform:[], reflections:{} };
        const cmap = {};
        if (Array.isArray(todaySnap)) todaySnap.forEach(h => { cmap[h.id] = h.completed; });
        else if (todaySnap && typeof todaySnap === 'object') Object.assign(cmap, todaySnap);

        if (!p.firstDate) p.firstDate = Object.keys(sum).sort()[0] || todayStr();
        if (p.lastDate && p.lastDate !== todayStr()) {
          const diff = Math.round((new Date(todayStr()) - new Date(p.lastDate)) / 86400000);
          if (diff > 1) p.streak = 0;
        }

        const yest = yesterdayStr();
        if (p.penaltyChecked !== yest) {
          const ySnap = await safeGet('bf_daily_'+yest);
          if (Array.isArray(ySnap) && ySnap.length > 0) {
            const missed = ySnap.filter(h => !h.completed);
            if (missed.length > 0) {
              let totalPen = 0; const statHit = {};
              missed.forEach(h => { totalPen += penaltyFor(h.xp); statHit[h.stat] = (statHit[h.stat]||0)+1; });
              p.totalXP = Math.max(0, p.totalXP - totalPen);
              Object.entries(statHit).forEach(([s,n]) => { p.stats[s] = Math.max(0, p.stats[s]-n); });
              sum[yest] = { ...(sum[yest]||{}), xpPenalty: totalPen };
              await safeSet('bf_summary', sum);
              setTimeout(() => { setPenWarn({ missed:missed.length, xp:totalPen }); penRef.current = setTimeout(() => setPenWarn(null), 7000); }, 900);
            }
          }
          p.penaltyChecked = yest;
          await safeSet('bf_player', p);
        }

        const tb = bl.find(b => b.date===todayStr());
        if (tb) {
          if (tb.reps)  setTodayReps(tb.reps);
          if (tb.run)   setTodayRun(tb.run);
          if (tb.sleep) setTodaySleep(tb.sleep);
        }

        setPlayer(p); setSummary(sum);
        setHabits(habitList.map(h => ({ ...h, completed: !!(cmap[h.id]) })));
        setNotes([...ns].sort((a,b) => b.timestamp-a.timestamp));
        setStudyLog(sl); setRevItems(ri); setBodyLog(bl); setMocks(mk);
        setDistractions(dist); setConsequences(cons); setSyllabus(syll); setExercises(exs);
        setPledge(gl.pledge||''); setGoals(gl.goals||[]);
        setLetter(gl.letter || { text:'', revealDate:'', written:false });
        setTransformLog(gl.transform||[]);
        setSavedReflection((gl.reflections||{})[todayStr()]||'');
        setReflection((gl.reflections||{})[todayStr()]||'');
      } catch (e) {
        setPlayer({ totalXP:0, stats:{STR:0,INT:0,END:0,AGI:0,WIS:0}, streak:0, bestStreak:0, lastDate:null, penaltyChecked:null, firstDate:todayStr() });
        setHabits(DEFAULT_HABITS.map(h => ({ ...h, completed:false })));
      }
      setLoading(false);
    })();
  }, []);

  // ── Flash ─────────────────────────────────────────────────────────────────────
  const flash = (msg, color='#33DDFF') => {
    if (notifRef.current) clearTimeout(notifRef.current);
    setNotif({ msg, color }); notifRef.current = setTimeout(() => setNotif(null), 3200);
  };

  // ── Persist day ───────────────────────────────────────────────────────────────
  const persistDay = async (updH, updP, baseSummary) => {
    const snap = updH.map(h => ({ ...h }));
    const completed = updH.filter(h => h.completed).length;
    const xpEarned  = updH.filter(h => h.completed).reduce((s,h) => s+h.xp, 0);
    const base   = baseSummary || summary;
    const newSum = { ...base, [todayStr()]: { ...(base[todayStr()]||{}), completed, total:updH.length, xpEarned } };
    setSummary(newSum);
    setHistDetail(prev => ({ ...prev, [todayStr()]:snap }));
    await safeSet('bf_daily_'+todayStr(), snap);
    await safeSet('bf_summary', newSum);
    await safeSet('bf_player', updP);
  };

  // ── Toggle habit ──────────────────────────────────────────────────────────────
  const toggleHabit = async id => {
    const h = habits.find(x => x.id===id); if (!h) return;
    const was  = h.completed;
    const newH = habits.map(x => x.id===id ? { ...x, completed:!x.completed } : x);
    const newP = { ...player, totalXP:Math.max(0, player.totalXP+(was?-h.xp:h.xp)), stats:{ ...player.stats, [h.stat]:Math.max(0,player.stats[h.stat]+(was?-2:2)) }, lastDate:todayStr() };
    if (!was && newH.every(x => x.completed) && player.lastDate!==todayStr()) {
      newP.streak = (player.streak||0)+1;
      newP.bestStreak = Math.max(newP.streak, player.bestStreak||0);
    }
    setHabits(newH); setPlayer(newP);
    await persistDay(newH, newP);
    const pR = getRank(player.totalXP), nR = getRank(newP.totalXP);
    if (!was) flash('QUEST COMPLETE  +'+h.xp+' XP');
    if (pR.name!==nR.name) setTimeout(() => flash('RANK UP!  Now '+nR.name+'-Rank Warrior', nR.color), 1800);
  };

  // ── Quest CRUD ────────────────────────────────────────────────────────────────
  const saveHabit = async () => {
    if (!nName.trim()) return;
    let upd;
    if (editId) upd = habits.map(h => h.id===editId ? { ...h, name:nName.trim(), sub:nSub.trim(), xp:nXP, stat:nStat, icon:nIcon } : h);
    else upd = [...habits, { id:'h_'+Date.now(), name:nName.trim(), sub:nSub.trim(), xp:nXP, stat:nStat, icon:nIcon, completed:false }];
    setHabits(upd); setNName(''); setNSub(''); setAddOpen(false); setEditId(null); setNIcon('✦');
    await safeSet('bf_habitList', upd.map(({ completed, ...r }) => r));
    flash(editId?'QUEST UPDATED':'QUEST ADDED', '#33FF99');
  };

  const removeHabit = async id => {
    const upd = habits.filter(h => h.id!==id); setHabits(upd);
    await safeSet('bf_habitList', upd.map(({ completed, ...r }) => r));
  };

  const moveHabit = (id, dir) => {
    const i = habits.findIndex(h => h.id===id);
    if (i<0 || i+dir<0 || i+dir>=habits.length) return;
    const u = [...habits]; [u[i],u[i+dir]] = [u[i+dir],u[i]]; setHabits(u);
    safeSet('bf_habitList', u.map(({ completed, ...r }) => r));
  };

  const openEdit = h => { setEditId(h.id); setNName(h.name); setNSub(h.sub||''); setNXP(h.xp); setNStat(h.stat); setNIcon(h.icon||'✦'); setAddOpen(true); };

  // ── History ───────────────────────────────────────────────────────────────────
  const openHistory = async date => {
    if (expandedDate===date) { setExpandedDate(null); return; }
    if (!histDetail[date]) { const s = await safeGet('bf_daily_'+date); if (s) setHistDetail(p => ({ ...p, [date]:s })); }
    setExpandedDate(date);
  };

  // ── Reflection ────────────────────────────────────────────────────────────────
  const saveReflection = async () => {
    setSavedReflection(reflection);
    const gl = (await safeGet('bf_goals')) || {};
    gl.reflections = gl.reflections || {};
    gl.reflections[todayStr()] = reflection;
    await safeSet('bf_goals', gl);
    flash('REFLECTION SAVED', '#33FF99');
  };

  // ── Distractions ──────────────────────────────────────────────────────────────
  const addDistraction = async () => {
    if (!distWhat.trim()) return;
    const d = { id:'d_'+Date.now(), date:todayStr(), what:distWhat.trim(), category:distCat, trigger:distTrigger.trim(), timeOfDay:distTime, timestamp:Date.now() };
    const upd = [d, ...distractions]; setDistractions(upd); setDistWhat(''); setDistTrigger('');
    await safeSet('bf_distractions', upd); flash('DISTRACTION LOGGED', '#FF6666');
  };

  const deleteDistraction = async id => { const upd = distractions.filter(d => d.id!==id); setDistractions(upd); await safeSet('bf_distractions', upd); };

  // ── Consequences ──────────────────────────────────────────────────────────────
  const addConsequence = async () => {
    if (!consText.trim()) return;
    const c = { id:'c_'+Date.now(), date:todayStr(), missed:consMissed, consequence:consText.trim(), done:false };
    const upd = [c, ...consequences]; setConsequences(upd); setConsText(''); setConsMissed('');
    await safeSet('bf_consequences', upd); flash('CONSEQUENCE SET', '#FF9933');
  };

  const toggleConsequence = async id => { const upd = consequences.map(c => c.id===id ? { ...c, done:!c.done } : c); setConsequences(upd); await safeSet('bf_consequences', upd); };

  // ── Study ─────────────────────────────────────────────────────────────────────
  const logStudy = async () => {
    if (!studyTopic.trim() || studyMins<=0) return;
    const s = { id:'s_'+Date.now(), date:todayStr(), subject:studySub, topic:studyTopic.trim(), minutes:Number(studyMins) };
    const upd = [...studyLog, s]; setStudyLog(upd); setStudyTopic('');
    await safeSet('bf_study', upd); flash('+'+studyMins+'min '+studySub, SUB_C[studySub]);
  };

  const addRevision = async () => {
    if (!newRevTopic.trim()) return;
    const item = { id:'r_'+Date.now(), topic:newRevTopic.trim(), subject:newRevSub, addedDate:todayStr(), stage:0, lastReview:null };
    const upd = [...revItems, item]; setRevItems(upd); setNewRevTopic('');
    await safeSet('bf_revision', upd); flash('REVISION ADDED', '#FFE044');
  };

  const markRevised = async id => {
    const upd = revItems.map(r => r.id!==id ? r : { ...r, stage:Math.min(r.stage+1,REV_DAYS.length-1), lastReview:todayStr() });
    setRevItems(upd); await safeSet('bf_revision', upd); flash('REVIEWED ✓', '#33FF99');
  };

  const removeRevision = async id => { const upd = revItems.filter(r => r.id!==id); setRevItems(upd); await safeSet('bf_revision', upd); };

  const addMock = async () => {
    if (!mockScore) return;
    const m = { id:'m_'+Date.now(), date:todayStr(), subject:mockSub, score:Number(mockScore), max:Number(mockMax), topic:mockTopic.trim() };
    const upd = [m, ...mocks]; setMocks(upd); setMockScore(''); setMockTopic('');
    await safeSet('bf_mocks', upd); flash('Mock: '+Math.round((m.score/m.max)*100)+'%', SUB_C[mockSub]);
  };

  const toggleSyllabus = async key => { const upd = { ...syllabus, [key]:!syllabus[key] }; setSyllabus(upd); await safeSet('bf_syllabus', upd); };

  // ── Body ──────────────────────────────────────────────────────────────────────
  const addExercise = async () => {
    if (!newExercise.trim()) return;
    const upd = [...exercises, newExercise.trim()]; setExercises(upd); setNewExercise('');
    await safeSet('bf_exercises', upd);
  };

  const removeExercise = async ex => {
    const upd = exercises.filter(e => e!==ex); setExercises(upd);
    await safeSet('bf_exercises', upd);
  };

  const saveBodyLog = async () => {
    const entry = { date:todayStr(), reps:todayReps, run:todayRun, sleep:todaySleep };
    const upd   = [...bodyLog.filter(b => b.date!==todayStr()), entry];
    setBodyLog(upd); await safeSet('bf_body', upd); flash('BODY LOG SAVED', '#FF6666');
  };

  // ── Notes ─────────────────────────────────────────────────────────────────────
  const addNote = async () => {
    if (!noteText.trim()) return;
    const n = { id:'n_'+Date.now(), date:todayStr(), text:noteText.trim(), mood:noteMood, tags:noteTags, timestamp:Date.now() };
    const upd = [n, ...notes]; setNotes(upd); setNoteText(''); setNoteTags([]);
    await safeSet('bf_notes', upd); flash('ENTRY SAVED', '#CC77FF');
  };

  const deleteNote = async id => { const upd = notes.filter(n => n.id!==id); setNotes(upd); await safeSet('bf_notes', upd); };

  // ── Goals ─────────────────────────────────────────────────────────────────────
  const saveGoalData = async (patch) => {
    const gl = (await safeGet('bf_goals')) || {};
    await safeSet('bf_goals', { ...gl, pledge, goals, letter, transform:transformLog, ...patch });
  };

  const addGoal = async () => {
    if (!newGoal.trim()) return;
    const upd = [...goals, { id:'g_'+Date.now(), text:newGoal.trim(), deadline:newGoalDL, done:false }];
    setGoals(upd); setNewGoal(''); setNewGoalDL('');
    await saveGoalData({ goals:upd }); flash('GOAL SET', '#CC77FF');
  };

  const toggleGoal   = async id => { const upd = goals.map(g => g.id===id ? { ...g, done:!g.done } : g); setGoals(upd); await saveGoalData({ goals:upd }); };
  const savePledge   = async () => { await saveGoalData({ pledge }); flash('PLEDGE SAVED', '#FF9933'); };
  const saveLetter   = async () => { const upd = { ...letter, written:true }; setLetter(upd); await saveGoalData({ letter:upd }); flash('LETTER SEALED 🔒', '#CC77FF'); };
  const addTransform = async () => {
    if (!newTransform.trim()) return;
    const upd = [{ id:'t_'+Date.now(), date:todayStr(), text:newTransform.trim() }, ...transformLog];
    setTransformLog(upd); setNewTransform(''); await saveGoalData({ transform:upd }); flash('SNAPSHOT SAVED', '#33FF99');
  };

  // ── Export ────────────────────────────────────────────────────────────────────
  const exportData = async () => {
    const keys = ['bf_player','bf_habitList','bf_summary','bf_notes','bf_study','bf_revision','bf_body','bf_goals','bf_mocks','bf_distractions','bf_consequences','bf_syllabus','bf_exercises'];
    const data = { exportDate:todayStr() };
    for (const k of keys) data[k] = await safeGet(k);
    const blob = new Blob([JSON.stringify(data,null,2)], { type:'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a'); a.href=url; a.download='becoming-firdaus-'+todayStr()+'.json'; a.click();
    URL.revokeObjectURL(url); flash('DATA EXPORTED', '#33FF99');
  };

  // ── Computed ──────────────────────────────────────────────────────────────────
  const chartData = useMemo(() =>
    Object.keys(summary).sort().slice(-30).map(d => ({ date:d.slice(5), pct:summary[d].total>0?Math.round((summary[d].completed/summary[d].total)*100):0, xp:summary[d].xpEarned||0, pen:summary[d].xpPenalty||0 }))
  , [summary]);

  const moodChart = useMemo(() => {
    const m = {}; notes.forEach(n => { const md=MOODS.find(x=>x.emoji===n.mood); if(md&&!m[n.date]) m[n.date]=md.val; });
    return Object.keys(m).sort().slice(-20).map(d => ({ date:d.slice(5), mood:m[d] }));
  }, [notes]);

  const missedAnalysis = useMemo(() => {
    const c = {}; Object.values(histDetail).forEach(snap => { if(!Array.isArray(snap)) return; snap.forEach(h => { if(!h.completed) c[h.name]=(c[h.name]||0)+1; }); });
    return Object.entries(c).sort((a,b) => b[1]-a[1]).slice(0,5);
  }, [histDetail]);

  const weeklyReview = useMemo(() => {
    const days = []; for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);days.push(d.toISOString().split('T')[0]);}
    let tQ=0,dQ=0,eXP=0,pXP=0;
    days.forEach(d => { const s=summary[d]; if(!s) return; tQ+=s.total||0; dQ+=s.completed||0; eXP+=s.xpEarned||0; pXP+=s.xpPenalty||0; });
    const best = days.reduce((b,d) => { const s=summary[d]||{completed:0,total:1},bs=summary[b]||{completed:0,total:1}; return(s.completed/s.total)>(bs.completed/bs.total)?d:b; }, days[0]);
    return { tQ, dQ, eXP, pXP, netXP:eXP-pXP, best, pct:tQ>0?Math.round((dQ/tQ)*100):0 };
  }, [summary]);

  const dueRevisions = useMemo(() => revItems.filter(r => r.stage<REV_DAYS.length && getRevNext(r)<=todayStr()), [revItems]);

  const syllabusProgress = useMemo(() => {
    const p = {}; SUBJECTS.forEach(s => { const total=SYLLABUS[s].length,done=SYLLABUS[s].filter(t=>syllabus[s+'_'+t]).length; p[s]={done,total,pct:Math.round((done/total)*100)}; }); return p;
  }, [syllabus]);

  const todayStudy = useMemo(() => {
    const b = { Physics:0, Chemistry:0, Biology:0 };
    studyLog.filter(s => s.date===todayStr()).forEach(s => { b[s.subject]=(b[s.subject]||0)+s.minutes; }); return b;
  }, [studyLog]);

  const subjectHoursChart = useMemo(() => {
    const days = []; for(let i=13;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);days.push(d.toISOString().split('T')[0]);}
    return days.map(ds => {
      const logs = studyLog.filter(s => s.date===ds);
      return { date:ds.slice(5), Physics:+(logs.filter(s=>s.subject==='Physics').reduce((a,s)=>a+s.minutes,0)/60).toFixed(1), Chemistry:+(logs.filter(s=>s.subject==='Chemistry').reduce((a,s)=>a+s.minutes,0)/60).toFixed(1), Biology:+(logs.filter(s=>s.subject==='Biology').reduce((a,s)=>a+s.minutes,0)/60).toFixed(1) };
    });
  }, [studyLog]);

  const personalRecords = useMemo(() => {
    const r = {}; bodyLog.forEach(b => { if(!b.reps) return; Object.entries(b.reps).forEach(([ex,val]) => { const n=Number(val); if(!n) return; if(!r[ex]||n>r[ex].reps) r[ex]={reps:n,date:b.date}; }); }); return r;
  }, [bodyLog]);

  const repsChart = useMemo(() => {
    return bodyLog.slice(-10).map(b => { const e={date:b.date.slice(5)}; exercises.forEach(ex=>{e[ex]=Number(b.reps?.[ex])||0;}); return e; }).filter(e=>Object.values(e).some(v=>typeof v==='number'&&v>0));
  }, [bodyLog, exercises]);

  const distractionStats = useMemo(() => {
    const days=[]; for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);days.push(d.toISOString().split('T')[0]);}
    const week = distractions.filter(d => days.includes(d.date));
    const byCat = {}; DIST_CATS.forEach(c => { byCat[c]=week.filter(d=>d.category===c).length; });
    const byTime = {}; DIST_TIMES.forEach(t => { byTime[t]=week.filter(d=>d.timeOfDay===t).length; });
    return { total:week.length, byCat, byTime };
  }, [distractions]);

  const heatmap = useMemo(() => {
    const c=[]; for(let i=363;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const ds=d.toISOString().split('T')[0];const s=summary[ds];c.push({date:ds,pct:s&&s.total>0?Math.round((s.completed/s.total)*100):s?0:-1});} return c;
  }, [summary]);

  const rankEvolution = useMemo(() => {
    let xp=0; const ev=[]; let prev='';
    Object.keys(summary).sort().forEach(d => { xp+=((summary[d].xpEarned||0)-(summary[d].xpPenalty||0)); xp=Math.max(0,xp); const r=getRank(xp).name; if(r!==prev){ev.push({date:fmtDate(d),rank:r,xp,color:getRank(xp).color});prev=r;} }); return ev;
  }, [summary]);

  const totalStats = useMemo(() => ({
    days:          Object.keys(summary).length,
    totalCompleted:Object.values(summary).reduce((s,d)=>s+(d.completed||0),0),
    totalXP:       Object.values(summary).reduce((s,d)=>s+(d.xpEarned||0),0),
    studyHours:    Math.round(studyLog.reduce((s,l)=>s+l.minutes,0)/60),
  }), [summary, studyLog]);

  const heatCol = pct => { if(pct<0) return '#0D0D1A'; if(pct===0) return '#141428'; if(pct<34) return '#2A1518'; if(pct<67) return '#152035'; if(pct<100) return '#153040'; return '#00CC66'; };

  // ── Guard ─────────────────────────────────────────────────────────────────────
  if (!localStorage.getItem("bf_signed_in")) {
    return (
      <div style={{ background:"#04040C", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", padding:24 }}>
        <div style={{ fontFamily:"Orbitron,monospace", fontSize:20, color:"#33DDFF", marginBottom:8 }}>BECOMING FIRDAUS</div>
        <div style={{ color:"#5050A0", fontSize:13, marginBottom:32 }}>The Inner War Protocol</div>
        <GoogleAuth onSignedIn={() => window.location.reload()} />
        <div style={{ color:"#303060", fontSize:11, marginTop:16 }}>or continue anonymously — just use the app normally</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ background:'#04040C', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ textAlign:'center' }}>
          <div className="orb" style={{ color:'#33DDFF', fontSize:14, letterSpacing:4, marginBottom:8 }}>SYSTEM LOADING</div>
          <div style={{ color:'#4040A0', fontSize:12 }}>Becoming Firdaus</div>
        </div>
      </div>
    );
  }

  const rank      = getRank(player.totalXP);
  const nextRank  = getNextRank(player.totalXP);
  const xpPct     = getXPPct(player.totalXP);
  const doneCount = habits.filter(h => h.completed).length;
  const allDone   = doneCount===habits.length && habits.length>0;
  const histDates = Object.keys(summary).sort().reverse();
  const neetDays  = getNEETDays();
  const dayOfWar  = getDayOfWar(player.firstDate);
  const todayQ    = QUOTES[new Date().getDate() % QUOTES.length];
  const letterOk  = letter.written && letter.revealDate && todayStr() >= letter.revealDate;

  const calcSleep = (bed, wake) => {
    if (!bed || !wake) return null;
    const [bh,bm]=bed.split(':').map(Number), [wh,wm]=wake.split(':').map(Number);
    let m=(wh*60+wm)-(bh*60+bm); if(m<0) m+=1440;
    return { hr:Math.floor(m/60), mn:m%60 };
  };
  const sleepInfo = calcSleep(todaySleep.bed, todaySleep.wake);

  const BG   = '#04040C';
  const CARD = { background:'#0A0A1E', border:'1px solid #22224A', borderRadius:12, padding:16, marginBottom:14 };
  const GCARD= col => ({ ...CARD, border:'1px solid '+col+'40', boxShadow:'0 4px 28px '+col+'12' });
  const INP  = { background:'#0E0E28', border:'1px solid #28285A', borderRadius:8, padding:'9px 12px', color:'#F0F0FF', fontSize:13, outline:'none', width:'100%', marginBottom:8, fontFamily:'Inter,sans-serif' };
  const BTN  = (col='#33DDFF', pad='10px 14px') => ({ background:col+'22', border:'1px solid '+col+'55', color:col, borderRadius:8, padding:pad, fontSize:11, fontFamily:'Orbitron,monospace', cursor:'pointer', letterSpacing:1 });
  const LBL  = { fontFamily:'Orbitron,monospace', fontSize:9, color:'#7070B0', letterSpacing:3, marginBottom:12, display:'block' };
  const NAV  = a => ({ flex:1, padding:'10px 0', textAlign:'center', background:'transparent', border:'none', borderTop:a?'2px solid #33DDFF':'2px solid transparent', color:a?'#33DDFF':'#5050A0', cursor:'pointer', fontFamily:'Orbitron,monospace', fontSize:8, letterSpacing:1 });
  const SEC  = { fontSize:12, color:'#9090C0', lineHeight:1.5 };
  const DIM  = { fontSize:11, color:'#7070A0' };

  return (
    <div style={{ background:BG, minHeight:'100vh', fontFamily:'Inter,sans-serif', color:'#F0F0FF', maxWidth:480, margin:'0 auto', paddingBottom:80 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .orb{font-family:'Orbitron',monospace}
        .xbar{transition:width 0.8s cubic-bezier(.4,0,.2,1)}
        .fn{animation:si 0.3s ease,fo 0.4s 2.8s forwards}
        .pw{animation:si 0.3s ease,fo 0.5s 6.5s forwards}
        @keyframes si{from{transform:translateX(112%);opacity:0}to{transform:translateX(0);opacity:1}}
        @keyframes fo{to{transform:translateX(112%);opacity:0}}
        .rp{animation:rpa 2.8s ease-in-out infinite}
        @keyframes rpa{0%,100%{opacity:1}50%{opacity:.5}}
        .qi{transition:all 0.15s;border-radius:10px;border:1px solid transparent}
        .qi:hover{background:rgba(51,221,255,0.04)!important}
        .cb{cursor:pointer;border:none;outline:none;transition:transform 0.12s}
        .cb:active{transform:scale(0.8)}
        .hr{cursor:pointer;border:1px solid #22224A;border-radius:10px;margin-bottom:8px;transition:all 0.15s;padding:13px 14px}
        .hr:hover{background:rgba(255,255,255,0.02)}
        input,select,textarea{color-scheme:dark;font-family:Inter,sans-serif}
        textarea{resize:vertical}
        select{background:#0E0E28;border:1px solid #28285A;border-radius:8px;padding:9px 12px;color:#F0F0FF;font-size:12px;outline:none}
        ::-webkit-scrollbar{width:2px}
        ::-webkit-scrollbar-thumb{background:#22224A;border-radius:4px}
        .overlay{position:fixed;inset:0;background:rgba(2,2,10,0.93);z-index:200;display:flex;align-items:center;justify-content:center;padding:16px}
      `}</style>

      {/* Notif */}
      {notif && (
        <div className="fn" style={{ position:'fixed', top:16, right:16, zIndex:300, background:'#0A0A1E', border:'1px solid '+notif.color+'60', borderRadius:10, padding:'11px 15px', boxShadow:'0 8px 32px '+notif.color+'35', maxWidth:250 }}>
          <div className="orb" style={{ fontSize:8, color:notif.color, letterSpacing:2, marginBottom:4 }}>[ SYSTEM ]</div>
          <div style={{ fontSize:13, fontWeight:600, color:'#F0F0FF' }}>{notif.msg}</div>
        </div>
      )}

      {/* Penalty */}
      {penWarn && (
        <div className="pw" style={{ position:'fixed', top:notif?86:16, right:16, zIndex:299, background:'#110608', border:'1px solid #FF666660', borderRadius:10, padding:'12px 15px', boxShadow:'0 8px 32px rgba(255,102,102,0.25)', maxWidth:270 }}>
          <div className="orb" style={{ fontSize:8, color:'#FF6666', letterSpacing:2, marginBottom:5 }}>⚠ PENALTY APPLIED</div>
          <div style={{ fontSize:15, fontWeight:700, color:'#FF8888', marginBottom:3 }}>−{penWarn.xp} XP</div>
          <div style={{ ...DIM, color:'#804040', lineHeight:1.5 }}>{penWarn.missed} missed quest{penWarn.missed>1?'s':''} from yesterday.<br/>Stay disciplined, Warrior.</div>
        </div>
      )}

      {/* Share modal */}
      {shareImg && (
        <div className="overlay" onClick={() => setShareImg(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background:'#0A0A1E', borderRadius:16, padding:20, maxWidth:440, width:'100%', border:'1px solid #22224A' }}>
            <div className="orb" style={{ ...LBL, marginBottom:14 }}>SHARE CARD</div>
            <img src={shareImg} alt="share" style={{ width:'100%', borderRadius:10, marginBottom:14, display:'block' }} />
            <div style={{ display:'flex', gap:10, marginBottom:10 }}>
              <a href={shareImg} download={'becoming-firdaus-'+todayStr()+'.png'} style={{ flex:1, ...BTN('#33DDFF'), display:'block', textAlign:'center', textDecoration:'none' }}>↓ SAVE IMAGE</a>
              <button onClick={() => setShareImg(null)} style={{ flex:1, ...BTN('#505090') }}>CLOSE</button>
            </div>
            <div style={{ ...DIM, textAlign:'center' }}>Mobile: long-press image → Save to Photos</div>
          </div>
        </div>
      )}

      {/* Quest editor */}
      {addOpen && (
        <div className="overlay" onClick={() => { setAddOpen(false); setEditId(null); }}>
          <div onClick={e => e.stopPropagation()} style={{ background:'#0A0A1E', borderRadius:16, padding:20, maxWidth:440, width:'100%', border:'1px solid #33DDFF30' }}>
            <div className="orb" style={{ ...LBL, marginBottom:14 }}>{editId?'EDIT QUEST':'NEW QUEST'}</div>
            <input value={nName} onChange={e => setNName(e.target.value)} placeholder="Quest name…" style={{ ...INP, marginBottom:10 }} />
            <input value={nSub}  onChange={e => setNSub(e.target.value)}  placeholder="Description (optional)…" style={{ ...INP, marginBottom:10 }} />
            <div style={{ display:'flex', gap:10, marginBottom:12 }}>
              <select value={nStat} onChange={e => setNStat(e.target.value)} style={{ flex:1 }}>
                {Object.keys(SC).map(s => <option key={s} value={s}>{s} — {SL[s]}</option>)}
              </select>
              <div style={{ display:'flex', alignItems:'center', gap:8, background:'#0E0E28', border:'1px solid #28285A', borderRadius:8, padding:'0 12px' }}>
                <input type="number" value={nXP} min={5} max={50} onChange={e => setNXP(Number(e.target.value))}
                  style={{ width:46, background:'transparent', border:'none', color:'#33DDFF', fontFamily:'Orbitron,monospace', fontSize:14, outline:'none', textAlign:'center' }} />
                <span style={DIM}>XP</span>
              </div>
            </div>
            <div style={{ ...DIM, marginBottom:8 }}>Pick icon:</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:14 }}>
              {QUEST_ICONS.map(ic => (
                <button key={ic} onClick={() => setNIcon(ic)} style={{ width:36, height:36, borderRadius:8, border:'1px solid '+(nIcon===ic?'#33DDFF':'#22224A'), background:nIcon===ic?'#33DDFF22':'transparent', fontSize:18, cursor:'pointer' }}>
                  {ic}
                </button>
              ))}
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={saveHabit} style={{ flex:2, ...BTN('#33DDFF','11px 0') }}>{editId?'UPDATE':'ADD QUEST'}</button>
              <button onClick={() => { setAddOpen(false); setEditId(null); }} style={{ flex:1, ...BTN('#505090','11px 0') }}>CANCEL</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ padding:'16px 16px 0', marginBottom:14 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div className="orb" style={{ fontSize:8, color:'#303065', letterSpacing:2 }}>DAY {dayOfWar}</div>
            <div className="orb" style={{ fontSize:10, color:'#4040A0', letterSpacing:1 }}>THE INNER WAR</div>
          </div>
          <div style={{ textAlign:'center' }}>
            <div className="orb" style={{ fontSize:7, color:'#252550', letterSpacing:3 }}>SYSTEM:</div>
            <div className="orb" style={{ fontSize:20, fontWeight:900, color:'#33DDFF', letterSpacing:2, lineHeight:1.2 }}>BECOMING FIRDAUS</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div className="orb" style={{ fontSize:14, fontWeight:700, color:'#FF6666' }}>{neetDays}</div>
            <div className="orb" style={{ fontSize:7, color:'#4040A0', letterSpacing:1 }}>DAYS TO NEET</div>
          </div>
        </div>
      </div>

      <div style={{ padding:'0 12px' }}>

        {/* ═══════════════════ TODAY ═══════════════════ */}
        {tab==='today' && (
          <div>
            <div style={{ ...CARD, background:'#070718', padding:'14px 16px', marginBottom:10 }}>
              <div className="orb" style={{ fontSize:8, color:'#303065', letterSpacing:2, marginBottom:6 }}>DAILY WISDOM</div>
              <div style={{ fontSize:12, color:'#7070A0', lineHeight:1.7, fontStyle:'italic' }}>"{todayQ}"</div>
            </div>

            <div style={{ ...GCARD(rank.color), boxShadow:'0 0 40px '+rank.glow+', 0 4px 24px rgba(0,0,0,0.5)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:16 }}>
                <div className="rp" style={{ width:64, height:64, borderRadius:'50%', flexShrink:0, background:'radial-gradient(circle at 35% 35%,'+rank.color+'35,'+rank.color+'08)', border:'2px solid '+rank.color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Orbitron,monospace', fontSize:23, fontWeight:900, color:rank.color, boxShadow:'0 0 22px '+rank.glow }}>
                  {rank.name}
                </div>
                <div style={{ flex:1 }}>
                  <div className="orb" style={{ fontSize:15, fontWeight:700, marginBottom:3, color:'#F0F0FF' }}>{localStorage.getItem('bf_user_name') || 'Warrior'}</div>
                  <div style={{ ...SEC, marginBottom:10 }}>{rank.name}-Rank Warrior &nbsp;·&nbsp; {player.streak} day streak 🔥</div>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                    <span className="orb" style={{ fontSize:9, color:'#7070A0' }}>XP {player.totalXP.toLocaleString()}</span>
                    <span className="orb" style={{ fontSize:9, color:rank.color }}>{nextRank ? '→ '+nextRank.name+' at '+nextRank.minXP.toLocaleString() : 'MAX RANK ✦'}</span>
                  </div>
                  <div style={{ background:'#111130', borderRadius:4, height:7, overflow:'hidden' }}>
                    <div className="xbar" style={{ width:xpPct+'%', height:'100%', background:'linear-gradient(90deg,'+rank.color+'45,'+rank.color+')', boxShadow:'0 0 8px '+rank.color, borderRadius:4 }} />
                  </div>
                </div>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <div style={{ flex:1, background:'#060616', borderRadius:8, padding:'10px 12px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={SEC}>Today</span>
                  <span className="orb" style={{ fontSize:12, color:allDone?'#33FF99':'#33DDFF' }}>{doneCount}/{habits.length}{allDone?' ✓':''}</span>
                </div>
                <button onClick={() => setShareImg(buildShareCard(player, habits))} style={{ ...BTN('#CC77FF'), flexShrink:0 }}>SHARE</button>
              </div>
            </div>

            <div style={CARD}>
              <span style={LBL}>STAT WINDOW</span>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px 24px' }}>
                {Object.entries(player.stats).map(([stat, val]) => {
                  const col = SC[stat];
                  return (
                    <div key={stat}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                        <span className="orb" style={{ fontSize:9, color:col }}>{stat} <span style={{ color:'#6060A0', fontWeight:400 }}>{SL[stat]}</span></span>
                        <span style={{ fontSize:12, color:'#9090C0', fontFamily:'Orbitron,monospace' }}>{val}</span>
                      </div>
                      <div style={{ background:'#111130', borderRadius:4, height:5, overflow:'hidden' }}>
                        <div className="xbar" style={{ width:Math.min(val,100)+'%', height:'100%', background:col, boxShadow:'0 0 4px '+col+'70', borderRadius:4 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={CARD}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
                <span style={{ ...LBL, marginBottom:0 }}>DAILY QUESTS</span>
                <button onClick={() => { setEditId(null); setNName(''); setNSub(''); setNXP(15); setNStat('INT'); setNIcon('✦'); setAddOpen(true); }} style={BTN('#33DDFF','6px 12px')}>+ ADD</button>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                {habits.map((h, idx) => (
                  <div key={h.id} className="qi" style={{ display:'flex', alignItems:'center', padding:'10px', background:h.completed?'rgba(51,255,153,0.05)':'transparent', borderColor:h.completed?'rgba(51,255,153,0.15)':'transparent' }}>
                    <button className="cb" onClick={() => toggleHabit(h.id)} style={{ width:26, height:26, borderRadius:6, flexShrink:0, background:h.completed?'#33FF99':'transparent', border:'2px solid '+(h.completed?'#33FF99':'#28285A'), display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:900, color:'#04040C', boxShadow:h.completed?'0 0 12px rgba(51,255,153,0.4)':'none' }}>
                      {h.completed ? '✓' : ''}
                    </button>
                    <span style={{ fontSize:18, margin:'0 10px', flexShrink:0, opacity:h.completed?0.5:1 }}>{h.icon}</span>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:500, color:h.completed?'#404070':'#F0F0FF', textDecoration:h.completed?'line-through':'none', lineHeight:1.4 }}>{h.name}</div>
                      {h.sub && <div style={{ ...DIM, marginTop:2, lineHeight:1.4 }}>{h.sub}</div>}
                      <div style={{ fontSize:10, color:SC[h.stat], marginTop:3 }}>{h.stat} +2 · +{h.xp} XP · <span style={{ color:'#884444' }}>miss=−{penaltyFor(h.xp)}</span></div>
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', gap:1 }}>
                      <button onClick={() => moveHabit(h.id,-1)} style={{ background:'transparent', border:'none', color:idx===0?'#1A1A38':'#5050A0', cursor:'pointer', fontSize:11, padding:'1px 4px' }}>▲</button>
                      <button onClick={() => moveHabit(h.id,1)} style={{ background:'transparent', border:'none', color:idx===habits.length-1?'#1A1A38':'#5050A0', cursor:'pointer', fontSize:11, padding:'1px 4px' }}>▼</button>
                    </div>
                    <button onClick={() => openEdit(h)} style={{ background:'transparent', border:'none', color:'#5050A0', cursor:'pointer', fontSize:13, padding:'2px 6px' }}>✎</button>
                    <button onClick={() => removeHabit(h.id)} style={{ background:'transparent', border:'none', color:'#282850', cursor:'pointer', fontSize:18, padding:'2px 4px' }}>×</button>
                  </div>
                ))}
              </div>
            </div>

            <div style={CARD}>
              <span style={LBL}>END OF DAY REFLECTION</span>
              {savedReflection && <div style={{ ...SEC, marginBottom:10, padding:'8px 12px', background:'#33FF9910', borderRadius:8, borderLeft:'3px solid #33FF99', color:'#33FF99' }}>"{savedReflection}"</div>}
              <div style={{ display:'flex', gap:8 }}>
                <input value={reflection} onChange={e => setReflection(e.target.value)} placeholder="How did today go? One honest sentence…" style={{ flex:1, ...INP, marginBottom:0 }} />
                <button onClick={saveReflection} style={BTN('#33FF99')}>SAVE</button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════ STUDY ═══════════════════ */}
        {tab==='study' && (
          <div>
            <div style={{ display:'flex', gap:8, marginBottom:14 }}>
              {SUBJECTS.map(s => (
                <div key={s} style={{ flex:1, background:'#0A0A1E', border:'1px solid '+SUB_C[s]+'30', borderRadius:10, padding:'12px 8px', textAlign:'center' }}>
                  <div style={{ fontSize:20, marginBottom:4 }}>{SUB_I[s]}</div>
                  <div className="orb" style={{ fontSize:14, color:SUB_C[s], marginBottom:2 }}>{todayStudy[s]}m</div>
                  <div style={{ ...DIM }}>{s}</div>
                </div>
              ))}
            </div>

            <div style={CARD}>
              <span style={LBL}>LOG STUDY SESSION</span>
              <div style={{ display:'flex', gap:6, marginBottom:10 }}>
                {SUBJECTS.map(s => (
                  <button key={s} onClick={() => setStudySub(s)} style={{ flex:1, padding:'8px', borderRadius:8, border:'1px solid '+(studySub===s?SUB_C[s]:'#22224A'), background:studySub===s?SUB_C[s]+'22':'transparent', color:studySub===s?SUB_C[s]:'#7070A0', fontSize:12, cursor:'pointer', fontFamily:'Orbitron,monospace' }}>
                    {SUB_I[s]}
                  </button>
                ))}
              </div>
              <input value={studyTopic} onChange={e => setStudyTopic(e.target.value)} placeholder="Chapter / topic covered…" style={INP} />
              <div style={{ display:'flex', gap:8 }}>
                <div style={{ flex:1, display:'flex', alignItems:'center', gap:8, background:'#0E0E28', border:'1px solid #28285A', borderRadius:8, padding:'8px 12px' }}>
                  <span style={DIM}>Mins:</span>
                  <input type="number" value={studyMins} min={5} max={480} onChange={e => setStudyMins(e.target.value)}
                    style={{ flex:1, background:'transparent', border:'none', color:SUB_C[studySub], fontFamily:'Orbitron,monospace', fontSize:15, outline:'none', textAlign:'center' }} />
                </div>
                <button onClick={logStudy} style={BTN(SUB_C[studySub])}>LOG</button>
              </div>
              {studyLog.filter(s => s.date===todayStr()).length > 0 && (
                <div style={{ marginTop:12 }}>
                  {studyLog.filter(s => s.date===todayStr()).map(s => (
                    <div key={s.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'7px 0', borderBottom:'1px solid #111130' }}>
                      <div style={{ width:8, height:8, borderRadius:'50%', background:SUB_C[s.subject], flexShrink:0 }} />
                      <div style={{ flex:1 }}>
                        <div style={{ ...SEC }}>{s.topic}</div>
                        <div style={{ ...DIM, color:SUB_C[s.subject] }}>{s.subject}</div>
                      </div>
                      <span className="orb" style={{ fontSize:11, color:'#7070A0' }}>{s.minutes}m</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {subjectHoursChart.some(d => d.Physics>0||d.Chemistry>0||d.Biology>0) && (
              <div style={CARD}>
                <span style={LBL}>SUBJECT HOURS — LAST 14 DAYS</span>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={subjectHoursChart} margin={{ top:4, right:6, left:-22, bottom:0 }}>
                    <CartesianGrid strokeDasharray="2 4" stroke="#0E0E28" />
                    <XAxis dataKey="date" tick={{ fill:'#5050A0', fontSize:9 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill:'#5050A0', fontSize:9 }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background:'#0A0A1E', border:'1px solid #22224A', borderRadius:8, fontSize:11 }} labelStyle={{ color:'#F0F0FF' }} />
                    <Line type="monotone" dataKey="Physics"   stroke={SUB_C.Physics}   strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="Chemistry" stroke={SUB_C.Chemistry} strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="Biology"   stroke={SUB_C.Biology}   strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
                <div style={{ display:'flex', gap:16, marginTop:8 }}>
                  {SUBJECTS.map(s => <span key={s} style={{ ...DIM, color:SUB_C[s] }}>── {s}</span>)}
                </div>
              </div>
            )}

            <div style={CARD}>
              <span style={LBL}>MOCK TEST LOG</span>
              <div style={{ display:'flex', gap:6, marginBottom:10 }}>
                {SUBJECTS.map(s => (
                  <button key={s} onClick={() => setMockSub(s)} style={{ flex:1, padding:'7px', borderRadius:8, border:'1px solid '+(mockSub===s?SUB_C[s]:'#22224A'), background:mockSub===s?SUB_C[s]+'22':'transparent', color:mockSub===s?SUB_C[s]:'#7070A0', fontSize:12, cursor:'pointer', fontFamily:'Orbitron,monospace' }}>
                    {SUB_I[s]}
                  </button>
                ))}
              </div>
              <input value={mockTopic} onChange={e => setMockTopic(e.target.value)} placeholder="Test name / topic (optional)…" style={INP} />
              <div style={{ display:'flex', gap:8, marginBottom:10 }}>
                <div style={{ flex:1, display:'flex', alignItems:'center', gap:6, background:'#0E0E28', border:'1px solid #28285A', borderRadius:8, padding:'8px 12px' }}>
                  <span style={DIM}>Score</span>
                  <input type="number" value={mockScore} onChange={e => setMockScore(e.target.value)} placeholder="0"
                    style={{ flex:1, background:'transparent', border:'none', color:SUB_C[mockSub], fontFamily:'Orbitron,monospace', fontSize:14, outline:'none', textAlign:'center' }} />
                </div>
                <span style={{ alignSelf:'center', color:'#5050A0', fontSize:14 }}>/</span>
                <div style={{ flex:1, display:'flex', alignItems:'center', background:'#0E0E28', border:'1px solid #28285A', borderRadius:8, padding:'8px 12px' }}>
                  <input type="number" value={mockMax} onChange={e => setMockMax(e.target.value)} inputMode="numeric" onFocus={e => e.target.select()}
                    style={{ width:'100%', background:'transparent', border:'none', color:'#FFFFFF', fontFamily:'Orbitron,monospace', fontSize:14, outline:'none', textAlign:'center' }} />
                </div>
                </div>
              <button onClick={addMock} style={{...BTN('#FF9933'), width:'100%', marginTop:6}}>ADD</button>
              {mocks.slice(0,6).map(m => {
                const pct = Math.round((m.score/m.max)*100);
                const col = pct>=80?'#33FF99':pct>=60?'#FF9933':'#FF6666';
                return (
                  <div key={m.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom:'1px solid #111130' }}>
                    <div style={{ width:36, height:36, borderRadius:'50%', background:'conic-gradient('+col+' '+pct*3.6+'deg,#151530 '+pct*3.6+'deg)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <div style={{ width:26, height:26, borderRadius:'50%', background:'#0A0A1E', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <span className="orb" style={{ fontSize:8, color:col }}>{pct}%</span>
                      </div>
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ ...SEC }}>{m.topic||m.subject} <span style={DIM}>({m.score}/{m.max})</span></div>
                      <div style={{ ...DIM, color:SUB_C[m.subject] }}>{m.subject} · {fmtDate(m.date)}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={CARD}>
              <div style={{ display:'flex', alignItems:'center', marginBottom:12 }}>
                <span style={{ ...LBL, marginBottom:0, flex:1 }}>REVISION TRACKER</span>
                {dueRevisions.length > 0 && <span style={{ background:'#FF6666', color:'#fff', borderRadius:10, padding:'2px 8px', fontSize:8, fontFamily:'Orbitron,monospace' }}>{dueRevisions.length} DUE</span>}
              </div>
              {dueRevisions.length > 0 && (
                <div style={{ marginBottom:12 }}>
                  <div style={{ fontSize:9, color:'#FF6666', marginBottom:8, fontFamily:'Orbitron,monospace', letterSpacing:1 }}>⚠ REVIEW NOW</div>
                  {dueRevisions.map(r => (
                    <div key={r.id} style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 12px', background:'rgba(255,102,102,0.07)', border:'1px solid rgba(255,102,102,0.25)', borderRadius:9, marginBottom:6 }}>
                      <div style={{ flex:1 }}>
                        <div style={{ ...SEC }}>{r.topic}</div>
                        <div style={{ ...DIM, color:SUB_C[r.subject] }}>{r.subject} · Stage {r.stage+1}/{REV_DAYS.length}</div>
                      </div>
                      <button onClick={() => markRevised(r.id)} style={{ ...BTN('#33FF99','6px 10px'), fontSize:10 }}>DONE ✓</button>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ display:'flex', gap:6, marginBottom:8 }}>
                {SUBJECTS.map(s => <button key={s} onClick={() => setNewRevSub(s)} style={{ flex:1, padding:'6px', borderRadius:8, border:'1px solid '+(newRevSub===s?SUB_C[s]:'#22224A'), background:newRevSub===s?SUB_C[s]+'22':'transparent', color:newRevSub===s?SUB_C[s]:'#7070A0', fontSize:11, cursor:'pointer', fontFamily:'Orbitron,monospace' }}>{s.slice(0,4)}</button>)}
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <input value={newRevTopic} onChange={e => setNewRevTopic(e.target.value)} placeholder="Add topic to revise…" style={{ flex:1, ...INP, marginBottom:0 }} />
                <button onClick={addRevision} style={BTN('#FFE044')}>ADD</button>
              </div>
              {revItems.filter(r => !dueRevisions.includes(r)).length > 0 && (
                <div style={{ marginTop:12 }}>
                  <div className="orb" style={{ fontSize:9, color:'#404080', letterSpacing:2, marginBottom:8 }}>UPCOMING</div>
                  {revItems.filter(r => !dueRevisions.includes(r)).map(r => (
                    <div key={r.id} style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 0', borderBottom:'1px solid #111130' }}>
                      <div style={{ flex:1 }}>
                        <div style={{ ...SEC }}>{r.topic}</div>
                        <div style={{ ...DIM }}>{r.subject} · Next: {getRevNext(r)}</div>
                      </div>
                      <button onClick={() => removeRevision(r.id)} style={{ background:'transparent', border:'none', color:'#282850', cursor:'pointer', fontSize:16 }}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={CARD}>
              <span style={LBL}>NEET SYLLABUS CHECKLIST</span>
              <div style={{ display:'flex', gap:6, marginBottom:12 }}>
                {SUBJECTS.map(s => {
                  const pr = syllabusProgress[s];
                  return (
                    <button key={s} onClick={() => setSyllabusTab(s)} style={{ flex:1, padding:'8px 4px', borderRadius:8, border:'1px solid '+(syllabusTab===s?SUB_C[s]:'#22224A'), background:syllabusTab===s?SUB_C[s]+'22':'transparent', color:syllabusTab===s?SUB_C[s]:'#7070A0', fontSize:10, cursor:'pointer', fontFamily:'Orbitron,monospace' }}>
                      {SUB_I[s]} {pr.done}/{pr.total}
                    </button>
                  );
                })}
              </div>
              <div style={{ background:'#111130', borderRadius:4, height:5, marginBottom:12, overflow:'hidden' }}>
                <div style={{ width:syllabusProgress[syllabusTab].pct+'%', height:'100%', background:SUB_C[syllabusTab], borderRadius:4, transition:'width 0.5s' }} />
              </div>
              <div style={{ maxHeight:300, overflowY:'auto' }}>
                {SYLLABUS[syllabusTab].map(topic => {
                  const key  = syllabusTab+'_'+topic;
                  const done = !!syllabus[key];
                  return (
                    <div key={topic} onClick={() => toggleSyllabus(key)} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom:'1px solid #111130', cursor:'pointer' }}>
                      <div style={{ width:18, height:18, borderRadius:4, flexShrink:0, background:done?SUB_C[syllabusTab]:'transparent', border:'2px solid '+(done?SUB_C[syllabusTab]:'#28285A'), display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:900, color:'#04040C' }}>
                        {done ? '✓' : ''}
                      </div>
                      <span style={{ fontSize:12, color:done?'#5050A0':'#D0D0F0', textDecoration:done?'line-through':'none' }}>{topic}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════ BODY ═══════════════════ */}
        {tab==='body' && (
          <div>
            {Object.keys(personalRecords).length > 0 && (
              <div style={{ ...CARD, marginBottom:10 }}>
                <span style={LBL}>PERSONAL RECORDS 🏆</span>
                <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                  {Object.entries(personalRecords).map(([ex, rec]) => (
                    <div key={ex} style={{ flex:'1 1 45%', background:'#0E0E28', borderRadius:8, padding:'10px 12px', border:'1px solid #FFE04430' }}>
                      <div style={{ ...DIM, marginBottom:3 }}>{ex}</div>
                      <div className="orb" style={{ fontSize:16, color:'#FFE044' }}>{rec.reps} <span style={{ fontSize:10 }}>reps</span></div>
                      <div style={{ ...DIM, marginTop:2 }}>{fmtDate(rec.date)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={CARD}>
              <span style={LBL}>WORKOUT LOG</span>
              {exercises.map(ex => {
                const pr = personalRecords[ex];
                const cur = Number(todayReps[ex]) || 0;
                const isPB = pr && cur > pr.reps;
                return (
                  <div key={ex} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                    <div style={{ flex:1 }}>
                      <span style={{ ...SEC }}>{ex}</span>
                      {pr && <span style={{ ...DIM, marginLeft:8 }}>PB: {pr.reps}</span>}
                      {isPB && <span style={{ marginLeft:8, fontSize:10, color:'#FFE044', fontFamily:'Orbitron,monospace' }}>NEW PB! 🏆</span>}
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:8, background:'#0E0E28', border:'1px solid '+(isPB?'#FFE04460':'#28285A'), borderRadius:8, padding:'7px 12px' }}>
                      <input type="number" value={todayReps[ex]||''} onChange={e => setTodayReps(p => ({ ...p, [ex]:e.target.value }))}
                        placeholder="0" style={{ width:50, background:'transparent', border:'none', color:'#FF6666', fontFamily:'Orbitron,monospace', fontSize:15, outline:'none', textAlign:'center' }} />
                      <span style={DIM}>reps</span>
                    </div>
                    <button onClick={() => removeExercise(ex)} style={{ background:'transparent', border:'none', color:'#282850', cursor:'pointer', fontSize:16 }}>×</button>
                  </div>
                );
              })}
              <div style={{ display:'flex', gap:8, marginTop:6 }}>
                <input value={newExercise} onChange={e => setNewExercise(e.target.value)} onKeyDown={e => e.key==='Enter'&&addExercise()} placeholder="Add exercise…" style={{ flex:1, ...INP, marginBottom:0 }} />
                <button onClick={addExercise} style={BTN('#FF6666','9px 14px')}>ADD</button>
              </div>
            </div>

            {repsChart.length > 1 && exercises.length > 0 && (
              <div style={CARD}>
                <span style={LBL}>REPS PROGRESS</span>
                <ResponsiveContainer width="100%" height={150}>
                  <LineChart data={repsChart} margin={{ top:4, right:6, left:-22, bottom:0 }}>
                    <CartesianGrid strokeDasharray="2 4" stroke="#0E0E28" />
                    <XAxis dataKey="date" tick={{ fill:'#5050A0', fontSize:9 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill:'#5050A0', fontSize:9 }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background:'#0A0A1E', border:'1px solid #22224A', borderRadius:8, fontSize:11 }} labelStyle={{ color:'#F0F0FF' }} />
                    {exercises.slice(0,4).map((ex,i) => {
                      const cols = ['#FF6666','#33DDFF','#FFE044','#33FF99'];
                      return <Line key={ex} type="monotone" dataKey={ex} stroke={cols[i%4]} strokeWidth={2} dot={false} name={ex} />;
                    })}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            <div style={CARD}>
              <span style={LBL}>RUN LOG</span>
              <div style={{ display:'flex', gap:10 }}>
                {[['Distance (km)', todayRun.distance, v => setTodayRun(p => ({ ...p, distance:v })), '2.0'],
                  ['Time (mm:ss)',  todayRun.time,     v => setTodayRun(p => ({ ...p, time:v })),     '12:30'],
                ].map(([label, val, setter, ph]) => (
                  <div key={label} style={{ flex:1 }}>
                    <div style={{ ...DIM, marginBottom:6 }}>{label}</div>
                    <input value={val} onChange={e => setter(e.target.value)} placeholder={ph}
                      style={{ width:'100%', background:'#0E0E28', border:'1px solid #28285A', borderRadius:8, padding:'10px', color:'#33FF99', fontFamily:'Orbitron,monospace', fontSize:18, outline:'none', textAlign:'center' }} />
                  </div>
                ))}
              </div>
              {bodyLog.filter(b => b.run && b.run.distance).length > 0 && (
                <div style={{ marginTop:12 }}>
                  {bodyLog.filter(b => b.run && b.run.distance).slice(-5).reverse().map(b => (
                    <div key={b.date} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid #111130' }}>
                      <span style={DIM}>{fmtDate(b.date)}</span>
                      <span className="orb" style={{ fontSize:12, color:'#33FF99' }}>{b.run.distance} km</span>
                      <span style={DIM}>{b.run.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={CARD}>
              <span style={LBL}>SLEEP LOG</span>
              <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                <div style={{ flex:1 }}>
                  <div style={{ ...DIM, marginBottom:6 }}>Bed time</div>
                  <input type="time" value={todaySleep.bed} onChange={e => setTodaySleep(p => ({ ...p, bed:e.target.value }))}
                    style={{ width:'100%', background:'#0E0E28', border:'1px solid #28285A', borderRadius:8, padding:'9px 6px', color:'#33DDFF', fontSize:14, outline:'none', textAlign:'center' }} />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ ...DIM, marginBottom:6 }}>Wake time</div>
                  <input type="time" value={todaySleep.wake} onChange={e => setTodaySleep(p => ({ ...p, wake:e.target.value }))}
                    style={{ width:'100%', background:'#0E0E28', border:'1px solid #28285A', borderRadius:8, padding:'9px 6px', color:'#33DDFF', fontSize:14, outline:'none', textAlign:'center' }} />
                </div>
                {sleepInfo && (
                  <div style={{ textAlign:'center', flexShrink:0 }}>
                    <div style={{ ...DIM, marginBottom:2 }}>Duration</div>
                    <div className="orb" style={{ fontSize:16, color:'#33DDFF' }}>{sleepInfo.hr}h {sleepInfo.mn}m</div>
                  </div>
                )}
              </div>
            </div>

            <button onClick={saveBodyLog} style={{ width:'100%', ...BTN('#FF6666','12px 0'), fontSize:12, letterSpacing:2, marginBottom:14 }}>SAVE TODAY'S LOG</button>
          </div>
        )}

        {/* ═══════════════════ LOG ═══════════════════ */}
        {tab==='log' && (
          <div>
            <div style={GCARD('#33DDFF')}>
              <span style={LBL}>THIS WEEK'S REVIEW</span>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
                {[
                  ['Completion', weeklyReview.pct+'%',      weeklyReview.pct>=80?'#33FF99':weeklyReview.pct>=50?'#FF9933':'#FF6666'],
                  ['XP Earned',  '+'+weeklyReview.eXP,      '#CC77FF'],
                  ['Penalty',    '−'+weeklyReview.pXP,      '#FF6666'],
                  ['Net XP',     (weeklyReview.netXP>=0?'+':'')+weeklyReview.netXP, weeklyReview.netXP>=0?'#33FF99':'#FF6666'],
                  ['Quests',     weeklyReview.dQ+'/'+weeklyReview.tQ, '#33DDFF'],
                  ['Best Day',   weeklyReview.best?weeklyReview.best.slice(5):'—', '#FFE044'],
                ].map(([l,v,col]) => (
                  <div key={l} style={{ background:'#060616', borderRadius:8, padding:'10px 8px', textAlign:'center' }}>
                    <div style={{ ...DIM, marginBottom:4 }}>{l}</div>
                    <div className="orb" style={{ fontSize:13, color:col }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {missedAnalysis.length > 0 && (
              <div style={CARD}>
                <span style={LBL}>YOUR WEAK QUESTS</span>
                {missedAnalysis.map(([name, count]) => (
                  <div key={name} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                    <div style={{ flex:1, ...SEC }}>{name}</div>
                    <div style={{ width:70, background:'#111130', borderRadius:3, height:6, overflow:'hidden' }}>
                      <div style={{ width:Math.min((count/7)*100,100)+'%', height:'100%', background:'#FF6666', borderRadius:3 }} />
                    </div>
                    <span className="orb" style={{ fontSize:10, color:'#FF6666', width:24, textAlign:'right' }}>{count}×</span>
                  </div>
                ))}
              </div>
            )}

            {chartData.length > 0 && (
              <div>
                <div style={CARD}>
                  <span style={LBL}>DAILY COMPLETION %</span>
                  <ResponsiveContainer width="100%" height={150}>
                    <LineChart data={chartData} margin={{ top:4, right:6, left:-22, bottom:0 }}>
                      <CartesianGrid strokeDasharray="2 4" stroke="#0E0E28" />
                      <XAxis dataKey="date" tick={{ fill:'#5050A0', fontSize:9 }} tickLine={false} axisLine={false} />
                      <YAxis domain={[0,100]} tick={{ fill:'#5050A0', fontSize:9 }} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ background:'#0A0A1E', border:'1px solid #33DDFF30', borderRadius:8, fontSize:11 }} labelStyle={{ color:'#F0F0FF' }} itemStyle={{ color:'#33DDFF' }} formatter={v => [v+'%','Completion']} />
                      <Line type="monotone" dataKey="pct" stroke="#33DDFF" strokeWidth={2} dot={{ fill:'#33DDFF', r:3 }} activeDot={{ r:5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div style={CARD}>
                  <span style={LBL}>XP EARNED vs PENALTY</span>
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={chartData} margin={{ top:4, right:6, left:-22, bottom:0 }}>
                      <CartesianGrid strokeDasharray="2 4" stroke="#0E0E28" />
                      <XAxis dataKey="date" tick={{ fill:'#5050A0', fontSize:9 }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fill:'#5050A0', fontSize:9 }} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ background:'#0A0A1E', border:'1px solid #22224A', borderRadius:8, fontSize:11 }} labelStyle={{ color:'#F0F0FF' }} />
                      <Bar dataKey="xp"  fill="#CC77FF" radius={[3,3,0,0]} name="Earned" />
                      <Bar dataKey="pen" fill="#FF6666" radius={[3,3,0,0]} name="Penalty" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {moodChart.length > 1 && (
              <div style={CARD}>
                <span style={LBL}>MOOD TREND</span>
                <ResponsiveContainer width="100%" height={120}>
                  <LineChart data={moodChart} margin={{ top:4, right:6, left:-22, bottom:0 }}>
                    <CartesianGrid strokeDasharray="2 4" stroke="#0E0E28" />
                    <XAxis dataKey="date" tick={{ fill:'#5050A0', fontSize:9 }} tickLine={false} axisLine={false} />
                    <YAxis domain={[1,5]} tick={{ fill:'#5050A0', fontSize:9 }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background:'#0A0A1E', border:'1px solid #FFE04430', borderRadius:8, fontSize:11 }} labelStyle={{ color:'#F0F0FF' }} formatter={v => [MOODS.find(m=>m.val===v)?.label||v,'Mood']} />
                    <Line type="monotone" dataKey="mood" stroke="#FFE044" strokeWidth={2} dot={{ fill:'#FFE044', r:3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            <div style={CARD}>
              <span style={LBL}>DISTRACTION LOG</span>
              {distractionStats.total > 0 && (
                <div style={{ marginBottom:14, padding:'12px', background:'#0E0E28', borderRadius:10, border:'1px solid #FF666625' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
                    <span style={{ ...SEC }}>This week</span>
                    <span className="orb" style={{ fontSize:12, color:'#FF6666' }}>{distractionStats.total} total</span>
                  </div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                    {DIST_CATS.filter(c => distractionStats.byCat[c]>0).map(c => (
                      <div key={c} style={{ background:'#FF666618', border:'1px solid #FF666635', borderRadius:6, padding:'4px 10px' }}>
                        <span style={{ ...DIM, color:'#FF9999' }}>{c}: </span>
                        <span className="orb" style={{ fontSize:11, color:'#FF6666' }}>{distractionStats.byCat[c]}×</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <input value={distWhat} onChange={e => setDistWhat(e.target.value)} placeholder="What distracted you?" style={INP} />
              <input value={distTrigger} onChange={e => setDistTrigger(e.target.value)} placeholder="What triggered it?" style={INP} />
              <div style={{ display:'flex', gap:8, marginBottom:10 }}>
                <select value={distCat} onChange={e => setDistCat(e.target.value)} style={{ flex:1 }}>
                  {DIST_CATS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={distTime} onChange={e => setDistTime(e.target.value)} style={{ width:130 }}>
                  {DIST_TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <button onClick={addDistraction} style={BTN('#FF6666')}>LOG</button>
              </div>
              {distractions.length === 0
                ? <div style={{ ...DIM, textAlign:'center', padding:'12px 0', color:'#404080' }}>No distractions logged. Stay clean.</div>
                : distractions.slice(0,6).map(d => (
                    <div key={d.id} style={{ padding:'10px', background:'#0E0E28', borderRadius:8, marginBottom:6, border:'1px solid #FF666620' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                        <span style={{ ...SEC, fontWeight:500 }}>{d.what}</span>
                        <button onClick={() => deleteDistraction(d.id)} style={{ background:'transparent', border:'none', color:'#282850', cursor:'pointer', fontSize:16 }}>×</button>
                      </div>
                      {d.trigger && <div style={{ ...DIM, marginBottom:4 }}>Trigger: {d.trigger}</div>}
                      <div style={{ display:'flex', gap:8 }}>
                        <span style={{ fontSize:10, color:'#FF9999', background:'#FF666618', borderRadius:4, padding:'2px 7px' }}>{d.category}</span>
                        <span style={{ fontSize:10, color:'#7070A0', background:'#22224A', borderRadius:4, padding:'2px 7px' }}>{d.timeOfDay}</span>
                        <span style={{ ...DIM, marginLeft:'auto' }}>{fmtDate(d.date)}</span>
                      </div>
                    </div>
                  ))
              }
            </div>

            <div style={CARD}>
              <span style={LBL}>JOURNAL ENTRY</span>
              <div style={{ display:'flex', gap:5, marginBottom:10 }}>
                {MOODS.map(m => (
                  <button key={m.emoji} onClick={() => setNoteMood(m.emoji)} style={{ flex:1, padding:'7px 3px', borderRadius:8, cursor:'pointer', background:noteMood===m.emoji?'#1A1A3A':'transparent', border:'1px solid '+(noteMood===m.emoji?'#CC77FF':'#22224A'), display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
                    <span style={{ fontSize:17 }}>{m.emoji}</span>
                    <span style={{ fontSize:7, color:noteMood===m.emoji?'#CC77FF':'#4040A0', fontFamily:'Orbitron,monospace' }}>{m.label}</span>
                  </button>
                ))}
              </div>
              <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:10 }}>
                {NOTE_TAGS.map(t => (
                  <button key={t} onClick={() => setNoteTags(p => p.includes(t)?p.filter(x=>x!==t):[...p,t])}
                    style={{ padding:'4px 10px', borderRadius:20, fontSize:11, cursor:'pointer', border:'1px solid '+(noteTags.includes(t)?'#CC77FF70':'#22224A'), background:noteTags.includes(t)?'#CC77FF22':'transparent', color:noteTags.includes(t)?'#CC77FF':'#7070A0' }}>
                    {t}
                  </button>
                ))}
              </div>
              <textarea value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Reflect on your day…" rows={3} style={{ ...INP, lineHeight:1.7, marginBottom:10 }} />
              <button onClick={addNote} style={{ width:'100%', ...BTN('#CC77FF','11px 0'), letterSpacing:2 }}>SAVE ENTRY</button>
            </div>

            {notes.map(n => (
              <div key={n.id} style={CARD}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                  <span style={{ fontSize:20 }}>{n.mood}</span>
                  <div style={{ flex:1 }}>
                    <div className="orb" style={{ fontSize:9, color:'#5050A0', letterSpacing:2 }}>{fmtDate(n.date)}</div>
                    <div style={DIM}>{MOODS.find(m=>m.emoji===n.mood)?.label||''}</div>
                  </div>
                  <button onClick={() => deleteNote(n.id)} style={{ background:'transparent', border:'none', color:'#282850', cursor:'pointer', fontSize:18 }}>×</button>
                </div>
                {n.tags && n.tags.length > 0 && (
                  <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:8 }}>
                    {n.tags.map(t => <span key={t} style={{ fontSize:10, color:'#CC77FF', background:'#CC77FF1A', borderRadius:10, padding:'2px 8px' }}>{t}</span>)}
                  </div>
                )}
                <div style={{ fontSize:13, lineHeight:1.75, color:'#C8C8E8', whiteSpace:'pre-wrap' }}>{n.text}</div>
              </div>
            ))}

            <div style={CARD}>
              <span style={LBL}>ALL-TIME HISTORY</span>
              {histDates.length === 0
                ? <div style={{ ...DIM, textAlign:'center', padding:'40px 0', color:'#404080' }}>No history yet.</div>
                : histDates.map(date => {
                    const s   = summary[date];
                    const pct = s.total>0 ? Math.round((s.completed/s.total)*100) : 0;
                    const col = pct===100?'#33FF99':pct>=60?'#33DDFF':pct>=30?'#FF9933':'#FF6666';
                    const isOpen = expandedDate===date;
                    const detail = histDetail[date];
                    const dayNote = notes.find(n => n.date===date);
                    return (
                      <div key={date}>
                        <div className="hr" onClick={() => openHistory(date)}>
                          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                            <div style={{ width:42, height:42, borderRadius:'50%', flexShrink:0, background:'conic-gradient('+col+' '+pct*3.6+'deg,#151530 '+pct*3.6+'deg)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                              <div style={{ width:30, height:30, borderRadius:'50%', background:'#0A0A1E', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                <span className="orb" style={{ fontSize:9, color:col }}>{pct}%</span>
                              </div>
                            </div>
                            <div style={{ flex:1 }}>
                              <div style={{ fontSize:13, fontWeight:500, marginBottom:3, color:'#E0E0F8' }}>
                                {fmtDate(date)}
                                {date===todayStr() && <span style={{ marginLeft:8, fontSize:8, color:'#33DDFF', fontFamily:'Orbitron,monospace' }}>TODAY</span>}
                                {dayNote && <span style={{ marginLeft:8, fontSize:12 }}>{dayNote.mood}</span>}
                              </div>
                              <div style={DIM}>{s.completed}/{s.total} · +{s.xpEarned||0} XP{s.xpPenalty>0&&<span style={{ color:'#FF6666' }}> · −{s.xpPenalty} pen</span>}</div>
                            </div>
                            <span style={{ color:'#3A3A70', fontSize:11 }}>{isOpen?'▲':'▼'}</span>
                          </div>
                        </div>
                        {isOpen && (
                          <div style={{ background:'#060616', border:'1px solid #22224A', borderTop:'none', borderRadius:'0 0 10px 10px', padding:'6px 12px 12px', marginTop:-8, marginBottom:8 }}>
                            {detail
                              ? detail.map(h => (
                                  <div key={h.id} style={{ display:'flex', alignItems:'center', gap:9, padding:'7px 0', borderBottom:'1px solid #0E0E28' }}>
                                    <div style={{ width:18, height:18, borderRadius:4, flexShrink:0, background:h.completed?'#33FF99':'transparent', border:'2px solid '+(h.completed?'#33FF99':'#28285A'), display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:900, color:'#04040C' }}>
                                      {h.completed?'✓':''}
                                    </div>
                                    <span style={{ fontSize:14, flexShrink:0, opacity:h.completed?1:0.25 }}>{h.icon}</span>
                                    <span style={{ flex:1, fontSize:12, color:h.completed?'#C0C0E8':'#404070', textDecoration:h.completed?'none':'line-through' }}>{h.name}</span>
                                    {!h.completed && <span style={{ fontSize:10, color:'#FF6666' }}>−{penaltyFor(h.xp)} XP</span>}
                                  </div>
                                ))
                              : <div style={{ ...DIM, textAlign:'center', padding:'12px 0', color:'#404080' }}>Loading…</div>
                            }
                            {dayNote && (
                              <div style={{ marginTop:10, padding:'10px', background:'#0E0E28', borderRadius:8, border:'1px solid #CC77FF25' }}>
                                <div style={{ display:'flex', gap:8, marginBottom:4 }}>
                                  <span style={{ fontSize:16 }}>{dayNote.mood}</span>
                                  <span className="orb" style={{ fontSize:8, color:'#5050A0', letterSpacing:1, alignSelf:'center' }}>JOURNAL</span>
                                </div>
                                <div style={{ fontSize:12, color:'#A0A0C8', lineHeight:1.6 }}>{dayNote.text}</div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
              }
            </div>
          </div>
        )}

        {/* ═══════════════════ GOALS ═══════════════════ */}
        {tab==='goals' && (
          <div>
            <div style={{ ...GCARD('#FF6666'), textAlign:'center', padding:'28px 16px' }}>
              <div className="orb" style={{ fontSize:9, color:'#FF6666', letterSpacing:3, marginBottom:10 }}>NEET 2027 COUNTDOWN</div>
              <div className="orb" style={{ fontSize:60, fontWeight:900, color:'#FF6666', lineHeight:1, marginBottom:8 }}>{neetDays}</div>
              <div style={{ ...SEC, color:'#884444', marginBottom:4 }}>days remaining to change your life</div>
              <div style={{ ...DIM, color:'#4A1515' }}>Target: May 2nd, 2027</div>
            </div>

            <div style={CARD}>
              <span style={LBL}>ALL-TIME STATS</span>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                {[
                  ['Days Tracked',      totalStats.days,           '#33DDFF'],
                  ['Quests Completed',  totalStats.totalCompleted, '#33FF99'],
                  ['Total XP Earned',   totalStats.totalXP.toLocaleString(), rank.color],
                  ['Study Hours',       totalStats.studyHours+'h', '#FFE044'],
                  ['Best Streak',       (player.bestStreak||player.streak)+'d 🔥', '#FF9933'],
                  ['Current Rank',      rank.name+'-Rank', rank.color],
                ].map(([l,v,col]) => (
                  <div key={l} style={{ background:'#0E0E28', borderRadius:10, padding:'12px 14px' }}>
                    <div style={{ ...DIM, marginBottom:6 }}>{l}</div>
                    <div className="orb" style={{ fontSize:18, color:col }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={CARD}>
              <span style={LBL}>DAILY PLEDGE</span>
              {pledge && <div style={{ ...SEC, color:'#FF9933', marginBottom:10, padding:'12px', background:'#FF993310', borderRadius:8, borderLeft:'3px solid #FF9933' }}>"{pledge}"</div>}
              <textarea value={pledge} onChange={e => setPledge(e.target.value)} placeholder="Write your commitment to yourself…" rows={2} style={{ ...INP, lineHeight:1.65, marginBottom:10 }} />
              <button onClick={savePledge} style={{ width:'100%', ...BTN('#FF9933','10px 0'), letterSpacing:2 }}>SAVE PLEDGE</button>
            </div>

            <div style={CARD}>
              <span style={LBL}>CONSEQUENCE TRACKER</span>
              <div style={{ ...DIM, marginBottom:10 }}>When you miss a quest, commit to a consequence.</div>
              <input value={consMissed} onChange={e => setConsMissed(e.target.value)} placeholder="Missed quest…" style={INP} />
              <div style={{ display:'flex', gap:8 }}>
                <input value={consText} onChange={e => setConsText(e.target.value)} placeholder="My consequence will be…" style={{ flex:1, ...INP, marginBottom:0 }} />
                <button onClick={addConsequence} style={BTN('#FF6666')}>ADD</button>
              </div>
              {consequences.length > 0 && (
                <div style={{ marginTop:12 }}>
                  {consequences.slice(0,6).map(c => (
                    <div key={c.id} style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 10px', border:'1px solid '+(c.done?'#33FF9930':'#22224A'), borderRadius:9, marginBottom:6, background:c.done?'#33FF9910':'transparent' }}>
                      <button onClick={() => toggleConsequence(c.id)} style={{ width:20, height:20, borderRadius:4, flexShrink:0, background:c.done?'#33FF99':'transparent', border:'2px solid '+(c.done?'#33FF99':'#28285A'), display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:900, color:'#04040C', cursor:'pointer' }}>
                        {c.done?'✓':''}
                      </button>
                      <div style={{ flex:1 }}>
                        {c.missed && <div style={{ fontSize:10, color:'#FF6666', marginBottom:2 }}>Missed: {c.missed}</div>}
                        <div style={{ ...SEC, textDecoration:c.done?'line-through':'none', color:c.done?'#404070':'#E0E0F8' }}>{c.consequence}</div>
                        <div style={DIM}>{fmtDate(c.date)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={CARD}>
              <span style={LBL}>GOAL TIMELINE</span>
              <div style={{ display:'flex', gap:8, marginBottom:10 }}>
                <input value={newGoal} onChange={e => setNewGoal(e.target.value)} placeholder="Set a goal…" style={{ flex:1, ...INP, marginBottom:0 }} />
                <input type="date" value={newGoalDL} onChange={e => setNewGoalDL(e.target.value)}
                  style={{ width:130, background:'#0E0E28', border:'1px solid #28285A', borderRadius:8, padding:'9px 8px', color:'#F0F0FF', fontSize:12, outline:'none' }} />
                <button onClick={addGoal} style={BTN('#CC77FF')}>ADD</button>
              </div>
              {goals.length === 0
                ? <div style={{ ...DIM, textAlign:'center', padding:'16px 0', color:'#404080' }}>No goals set.</div>
                : goals.map(g => {
                    const dl    = g.deadline ? new Date(g.deadline+'T00:00:00') : null;
                    const dLeft = dl ? Math.ceil((dl - new Date()) / 86400000) : null;
                    return (
                      <div key={g.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px', background:g.done?'rgba(51,255,153,0.05)':'transparent', border:'1px solid '+(g.done?'rgba(51,255,153,0.2)':'#1E1E40'), borderRadius:9, marginBottom:8 }}>
                        <button onClick={() => toggleGoal(g.id)} style={{ width:22, height:22, borderRadius:5, flexShrink:0, background:g.done?'#33FF99':'transparent', border:'2px solid '+(g.done?'#33FF99':'#28285A'), display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:900, color:'#04040C', cursor:'pointer' }}>
                          {g.done ? '✓' : ''}
                        </button>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:13, fontWeight:500, color:g.done?'#404070':'#F0F0FF', textDecoration:g.done?'line-through':'none' }}>{g.text}</div>
                          {dLeft !== null && (
                            <div style={DIM}>
                              {fmtDate(g.deadline)} · <span style={{ color:dLeft<7?'#FF6666':dLeft<30?'#FF9933':'#33DDFF' }}>
                                {dLeft > 0 ? dLeft+'d left' : 'Deadline passed'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
              }
            </div>

            {/* Letter to future self */}
            <div style={CARD}>
              <span style={LBL}>LETTER TO FUTURE SELF 🔒</span>
              {!letter.written ? (
                <div>
                  <div style={{ ...DIM, marginBottom:10 }}>Write to the doctor you'll become. Seal it with a reveal date.</div>
                  <textarea value={letter.text} onChange={e => setLetter(l => ({ ...l, text:e.target.value }))} placeholder="Dear future Firdaus…" rows={5}
                    style={{ ...INP, lineHeight:1.7, marginBottom:10 }} />
                  <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:10 }}>
                    <span style={DIM}>Reveal on:</span>
                    <input type="date" value={letter.revealDate} onChange={e => setLetter(l => ({ ...l, revealDate:e.target.value }))}
                      style={{ flex:1, background:'#0E0E28', border:'1px solid #28285A', borderRadius:8, padding:'9px 10px', color:'#CC77FF', fontSize:13, outline:'none' }} />
                  </div>
                  <button onClick={saveLetter} style={{ width:'100%', ...BTN('#CC77FF','11px 0'), letterSpacing:2 }}>🔒 SEAL LETTER</button>
                </div>
              ) : letterOk ? (
                <div>
                  <div style={{ ...DIM, marginBottom:8, color:'#CC77FF' }}>📬 The letter has been revealed!</div>
                  <div style={{ fontSize:13, lineHeight:1.8, color:'#C0C0E8', whiteSpace:'pre-wrap', padding:'14px', background:'#0E0E28', borderRadius:10, border:'1px solid #CC77FF30' }}>{letter.text}</div>
                </div>
              ) : (
                <div style={{ textAlign:'center', padding:'24px 0' }}>
                  <div style={{ fontSize:40, marginBottom:8 }}>🔒</div>
                  <div className="orb" style={{ fontSize:11, color:'#CC77FF', marginBottom:6 }}>LETTER SEALED</div>
                  <div style={DIM}>Reveals on {fmtDate(letter.revealDate)}</div>
                  {letter.revealDate && (
                    <div style={{ ...DIM, color:'#CC77FF', marginTop:4 }}>
                      {Math.ceil((new Date(letter.revealDate+'T00:00:00')-new Date())/86400000)} days to go
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Rank evolution */}
            {rankEvolution.length > 0 && (
              <div style={CARD}>
                <span style={LBL}>RANK EVOLUTION</span>
                {rankEvolution.map((ev,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'9px 0', borderBottom:'1px solid #111130' }}>
                    <div style={{ width:28, height:28, borderRadius:'50%', border:'2px solid '+ev.color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <span className="orb" style={{ fontSize:10, color:ev.color }}>{ev.rank}</span>
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={SEC}>{ev.date}</div>
                      <div style={{ ...DIM, color:ev.color }}>{ev.rank}-Rank achieved</div>
                    </div>
                    <span className="orb" style={{ fontSize:10, color:'#5050A0' }}>{ev.xp.toLocaleString()} XP</span>
                  </div>
                ))}
              </div>
            )}

            {/* Transformation log */}
            <div style={CARD}>
              <span style={LBL}>TRANSFORMATION LOG</span>
              <div style={{ ...DIM, marginBottom:10 }}>Snapshot who you are today. Look back and see who you became.</div>
              <div style={{ display:'flex', gap:8 }}>
                <input value={newTransform} onChange={e => setNewTransform(e.target.value)} placeholder="Write a snapshot of today's you…" style={{ flex:1, ...INP, marginBottom:0 }} />
                <button onClick={addTransform} style={BTN('#33FF99')}>ADD</button>
              </div>
              {transformLog.slice(0,5).map(t => (
                <div key={t.id} style={{ padding:'12px', background:'#0E0E28', borderRadius:8, marginTop:8, borderLeft:'3px solid #33FF9940' }}>
                  <div style={{ ...DIM, marginBottom:4, color:'#33FF9880' }}>{fmtDate(t.date)}</div>
                  <div style={{ fontSize:12, color:'#B0B0D0', lineHeight:1.65 }}>{t.text}</div>
                </div>
              ))}
            </div>

            {/* Year heatmap */}
            <div style={CARD}>
              <span style={LBL}>YEAR HEATMAP</span>
              <div style={{ display:'flex', flexWrap:'wrap', gap:2 }}>
                {heatmap.map(d => (
                  <div key={d.date} title={d.date+' · '+d.pct+'%'} style={{ width:10, height:10, borderRadius:2, background:heatCol(d.pct), flexShrink:0 }} />
                ))}
              </div>
              <div style={{ display:'flex', gap:8, marginTop:8, flexWrap:'wrap' }}>
                {[['None','#0D0D1A'],['0%','#141428'],['1–33%','#2A1518'],['34–66%','#152035'],['67–99%','#153040'],['100%','#00CC66']].map(([l,c]) => (
                  <div key={l} style={{ display:'flex', alignItems:'center', gap:3 }}>
                    <div style={{ width:8, height:8, borderRadius:1, background:c }} />
                    <span style={{ ...DIM, fontSize:9 }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={exportData} style={{ width:'100%', ...BTN('#33FF99','12px 0'), fontSize:11, letterSpacing:2, marginBottom:14 }}>⬇ EXPORT DATA BACKUP</button>
          </div>
        )}

      </div>

      {/* ─────────────────── BOTTOM NAV ─────────────────── */}
      <nav style={{ position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:480, background:'#060616', borderTop:'1px solid #14143A', display:'flex', zIndex:100, paddingBottom:'env(safe-area-inset-bottom)' }}>
        {[
          { id:'today', icon:'⚔️', label:'TODAY' },
          { id:'study', icon:'📚', label:'STUDY' },
          { id:'body',  icon:'💪', label:'FITNESS' },
          { id:'log',   icon:'📊', label:'LOG' },
          { id:'goals', icon:'🎯', label:'GOALS' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={NAV(tab===t.id)}>
            <div style={{ fontSize:18, marginBottom:1 }}>{t.icon}</div>
            <div>{t.label}</div>
          </button>
        ))}
      </nav>
    </div>
  );
}
