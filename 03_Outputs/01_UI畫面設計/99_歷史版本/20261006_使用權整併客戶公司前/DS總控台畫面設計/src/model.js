import { DEMO_DATE } from './data.js';
export function daysUntil(date) { return Math.round((Date.parse(date+'T00:00:00Z')-Date.parse(DEMO_DATE+'T00:00:00Z'))/86400000); }
export function companyOf(s,id) { return s.companies.find(c=>c.id===id); }
export function productOf(s,id) { return s.products.find(p=>p.id===id); }
export function entitlementOf(s,company,product) { return s.entitlements.find(e=>e.company===company&&e.product===product); }
export function members(s,e) { return s.users.filter(u=>u.company===e.company&&u.product===e.product); }
export function seats(s,e) { const list=members(s,e); const active=list.filter(u=>u.status==='啟用').length; const invited=list.filter(u=>u.status==='邀請中').length; const inactive=list.filter(u=>u.status==='停用').length; const limit=s.plans.find(p=>p.id===e.plan)?.limit||0; return {active,invited,inactive,used:active+invited,limit,remaining:Math.max(0,limit-active-invited)}; }
export function serviceStatus(s,e) {
  if(e.stage==='等待開通')return {label:'等待開通',tone:'warn',reason:'產品使用權尚未開通'};
  if (!companyOf(s,e.company)?.enabled) return {label:'公司已暫停',tone:'bad',reason:'公司所有產品服務已暫停'};
  if (!productOf(s,e.product)?.enabled) return {label:'產品全域停用',tone:'bad',reason:'產品總開關已關閉'};
  if (!e.enabled) return {label:'產品已暫停',tone:'bad',reason:'此公司的產品使用權已暫停'};
  if (daysUntil(e.start)>0) return {label:'尚未開始',tone:'warn',reason:'此產品使用期間尚未開始'};
  if (daysUntil(e.end)<0) return {label:'已到期',tone:'bad',reason:'此產品使用期間已到期，底下帳號均不可使用'};
  if (daysUntil(e.end)<=30) return {label:'即將到期',tone:'warn',reason:'使用權仍有效'};
  return {label:'使用中',tone:'ok',reason:'使用權有效'};
}
export function accountAccess(s,u) {
  if(u.status==='停用') return {label:'不可使用',tone:'bad',reason:'帳號已停用，不占名額'};
  if(u.status==='邀請中') return {label:'等待接受',tone:'warn',reason:'尚未接受邀請，已占用 1 個名額'};
  const e=entitlementOf(s,u.company,u.product); if(!e) return {label:'不可使用',tone:'bad',reason:'沒有此產品使用權'};
  const a=serviceStatus(s,e); return ['使用中','即將到期'].includes(a.label)?{label:'可使用',tone:'ok',reason:'公司、產品使用權與帳號有效'}:{label:'不可使用',tone:'bad',reason:a.reason};
}
export function canActivate(s,u) { const e=entitlementOf(s,u.company,u.product); if(!e)return {ok:false,reason:'沒有產品使用權'}; const n=seats(s,e); if(n.used>=n.limit)return {ok:false,reason:`名額已滿（${n.used} / ${n.limit}），無法重新啟用。請先停用其他帳號或調整方案。`}; const st=serviceStatus(s,e); if(!['使用中','即將到期'].includes(st.label)) return {ok:false,reason:st.reason}; return {ok:true,reason:''}; }
export function featureAccess(s,company,f) {
  const e=entitlementOf(s,company,f.product); const p=productOf(s,f.product); const o=s.overrides.find(x=>x.company===company&&x.feature===f.id&&(!x.end||daysUntil(x.end)>=0)&&(!x.start||daysUntil(x.start)<=0));
  const quota=s.quotas.find(q=>q.company===company&&q.feature===f.id);
  const checks=[
    {name:'公司狀態',ok:companyOf(s,company)?.enabled,detail:companyOf(s,company)?.enabled?'正常':'整間公司已暫停'},
    {name:'產品總開關',ok:p?.enabled,detail:p?.enabled?'已開啟':'產品全域停用'},
    {name:'產品使用權',ok:!!e&&e.stage!=='等待開通'&&e.enabled&&daysUntil(e.start)<=0&&daysUntil(e.end)>=0,detail:!e?'未開通此產品':e.stage==='等待開通'?'等待開通':!e.enabled?'此產品使用權暫停':daysUntil(e.start)>0?'使用期間尚未開始':daysUntil(e.end)<0?'此產品已到期':`有效至 ${e.end}`},
    {name:'功能總開關',ok:f.enabled,detail:f.enabled?'已開啟':`${f.name}維護或停用中`},
    {name:'開放範圍',ok:f.scope==='全部客戶'||(f.scope==='指定客戶'&&f.clients.includes(company)),detail:f.scope==='全部客戶'?'全部有效客戶':f.scope==='指定客戶'?(f.clients.includes(company)?'已列入指定客戶':'未列入指定客戶'):'僅內部測試'},
    {name:'客戶權限設定',ok:o?.mode!=='強制關閉',detail:o?`${o.mode} · ${o.reason}`:'系統預設'},
    {name:'功能額度',ok:!quota||quota.used<quota.total,detail:quota?`${quota.used} / ${quota.total} ${quota.unit}`:'此展示功能未配置額度限制'}
  ];
  const failed=checks.filter(c=>!c.ok); return {label:failed.length?'不可使用':'可使用',tone:failed.length?'bad':'ok',reason:failed[0]?.detail||'所有條件符合',checks,mode:o?.mode||'系統預設'};
}
