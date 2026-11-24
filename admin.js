const { Redis } = require('@upstash/redis');
const crypto = require('crypto');
function authorized(req) {
  const expected=process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const supplied=String(req.headers['x-admin-password'] || '');
  const a=Buffer.from(supplied), b=Buffer.from(expected);
  return a.length===b.length && crypto.timingSafeEqual(a,b);
}
module.exports = async (req,res) => {
  if (!['GET','PATCH'].includes(req.method)) return res.status(405).json({error:'Method not allowed'});
  if (!authorized(req)) return res.status(401).json({error:'Admin so‘zi noto‘g‘ri.'});
  try {
    const db=Redis.fromEnv();
    if(req.method==='GET') {
      const ids=await db.zrange('huquqchiuz:result-index',0,-1,{rev:true});
      const values=ids.length ? await db.hmget('huquqchiuz:results',...ids) : [];
      const rows=values.filter(Boolean).map(v=>typeof v==='string'?JSON.parse(v):v);
      return res.status(200).json({rows});
    }
    const {id,grade14,grade15}=req.body || {};
    if(!id || !['0','1',0,1].includes(grade14) || !['0','1',0,1].includes(grade15)) return res.status(400).json({error:'14- va 15-savollar uchun 0 yoki 1 ballni tanlang.'});
    const raw=await db.hget('huquqchiuz:results',String(id));
    if(!raw) return res.status(404).json({error:'Natija topilmadi.'});
    const row=typeof raw==='string'?JSON.parse(raw):raw;
    row.answers[14].correct=Number(grade14)===1;
    row.answers[15].correct=Number(grade15)===1;
    row.manual_score=Number(grade14)+Number(grade15);
    row.score=row.auto_score+row.manual_score;
    row.percent=Math.round(row.score/15*100);
    row.manual_pending=false;
    row.graded_at=new Date().toISOString();
    await db.hset('huquqchiuz:results',{[String(id)]:JSON.stringify(row)});
    return res.status(200).json({row});
  } catch(e) { console.error(e); return res.status(500).json({error:'Redis bilan ishlashda xatolik. Upstash sozlamalarini tekshiring.'}); }
};
