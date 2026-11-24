const { Redis } = require('@upstash/redis');
const KEY = {1:'C',2:'A',3:'B',4:'D',5:'C',6:'B',7:'D',8:'A',9:'C',10:'B',11:'A',12:'D'};
const WRITTEN = {
  13: ['1','bir','bir oy','har oy','har oyda','har oyda bir marta','kamida bir oyda bir marta']
};
const norm = s => String(s ?? '').toLocaleLowerCase('uz').replace(/[’‘`´]/g,"'").replace(/[^a-z0-9\u0400-\u04ff]/g,'').trim();
const redis = () => Redis.fromEnv();
module.exports = async (req,res) => {
  if (req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});
  try {
    const {name, answers={}, duration_seconds=0, auto_submitted=false, started_at=null} = req.body || {};
    const cleanName = String(name || '').trim();
    if (cleanName.length < 3 || cleanName.length > 100) return res.status(400).json({error:'Ism-familiyangizni to‘liq kiriting.'});
    const detail = {}; let autoScore = 0;
    for (let i=1;i<=12;i++) {
      const value = String(answers[i] || '').trim().toUpperCase();
      const correct = value === KEY[i]; detail[i] = {answer:String(answers[i] || ''), correct};
      if (correct) autoScore++;
    }
    const v13 = String(answers[13] || '');
    const c13 = WRITTEN[13].some(x => norm(x) === norm(v13));
    detail[13] = {answer:v13, correct:c13}; if(c13) autoScore++;
    detail[14] = {answer:String(answers[14] || ''), correct:null};
    detail[15] = {answer:String(answers[15] || ''), correct:null};
    const id = `${Date.now()}-${Math.random().toString(36).slice(2,9)}`;
    const row = {id,name:cleanName,answers:detail,auto_score:autoScore,manual_score:null,score:autoScore,percent:Math.round(autoScore/15*100),manual_pending:true,duration_seconds:Math.max(0,Number(duration_seconds)||0),auto_submitted:!!auto_submitted,started_at,created_at:new Date().toISOString()};
    const db=redis();
    await db.hset('huquqchiuz:results',{[id]:JSON.stringify(row)});
    await db.zadd('huquqchiuz:result-index',{score:Date.now(),member:id});
    return res.status(200).json({score:autoScore,percent:row.percent,manual_pending:true});
  } catch(e) { console.error(e); return res.status(500).json({error:'Natijani saqlashda xatolik. Upstash ulanishini tekshiring.'}); }
};
