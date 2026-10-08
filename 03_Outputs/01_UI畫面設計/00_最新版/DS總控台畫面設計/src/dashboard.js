import {careSummary} from './care.js';
import {DEMO_DATE} from './data.js';
import {companyOf,productOf,seats,serviceStatus,daysUntil} from './model.js';
import {esc,status,btn,link} from './ui.js';


// Per-product planning examples for the seven days ending on DEMO_DATE.
// A new product without a profile must show missing data, never another product's metrics.
const productProfiles={
 e2b:{definition:'公司至少使用一次生成或分析功能', companies:['c1','c3','c4'],
  health:'部分功能異常', description:'社群影音分析等待偏長，相關人員處理中。',
  issues:[{title:'社群影音分析有 3 筆處理逾時',feature:'video',companies:['c1','c4'],owner:'林怡君',state:'處理中',note:'正在確認外部分析服務；最近更新 14:20。'}],
  features:[
   {id:'copy',name:'AI 商品文案生成',companies:['c1','c3','c4'],unit:'篇',daily:[100,130,120,145,160,155,170],resource:'文字 Token',amount:2450000,resourceUnit:'Token',note:'輸入與輸出合計；非帳單金額。'},
   {id:'image',name:'AI 商品圖片生成',companies:['c1','c4'],unit:'張',daily:[20,35,40,32,25,28,21],resource:'圖片生成量',amount:201,resourceUnit:'張',note:'圖片計量，與文字 Token 分開。'},
   {id:'video',name:'社群影音分析',companies:['c1','c4'],unit:'次',daily:[8,10,12,9,15,11,10],resource:'影音處理時間',amount:224,resourceUnit:'分鐘',note:'依送入分析的影音長度計量。'},
   {id:'analysis',name:'商品分析',companies:['c1','c3','c4'],unit:'次',daily:[50,55,65,60,70,55,65],resource:'文字 Token',amount:840000,resourceUnit:'Token',note:'與文案生成同單位，可比較消耗。'}]},
 web:{definition:'公司後台至少使用一次網站發布功能；訪客表單不計入公司後台使用',companies:['c2','c7','c8'],
  health:'服務正常',description:'網站瀏覽、發布與表單監控目前正常；功能開放狀態另列。',
  issues:[{title:'綠沐生活的網站發布需重新確認',feature:'publish',companies:['c2'],owner:'張凱文',state:'待確認',note:'資產驗證曾失敗；目前發布服務正常，待確認客戶重試結果。'}],
  features:[
   {id:'publish',name:'網站發布',companies:['c2','c7','c8'],unit:'次',daily:[7,10,8,11,9,12,8],resource:'發布傳輸量',amount:3.3,resourceUnit:'GB',note:'發布檔案傳輸；不含網站訪客流量。'},
   {id:'forms',name:'訪客表單送出',companies:['c2','c7','c8'],unit:'份',daily:[40,52,48,60,53,58,53],resource:'表單請求',amount:364,resourceUnit:'次',note:'來自客戶網站訪客，不代表客戶登入後台。'}]}
};
const dashFmt=n=>Number(n).toLocaleString('en-US',{maximumFractionDigits:1});
const dashSelected=(v,p)=>!v.dashProduct||v.dashProduct==='all'||v.dashProduct===p;
const dashUnique=values=>new Set(values).size;
function dashPanel(title,sub,body,tools=''){return `<section class="dash-panel"><header><div><h2>${title}</h2><p>${sub}</p></div>${tools}</header>${body}</section>`;}
function dashControl(label,key,value,active){return `<button class="btn small ${active?'selected':'ghost'}" data-action="dashSet" data-key="${key}" data-value="${value}" aria-pressed="${active}">${label}</button>`;}
function dashTable(head,rows){return `<div class="table-scroll"><table class="dash-table"><thead><tr>${head.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${rows||`<tr><td colspan="${head.length}">目前沒有符合條件的資料</td></tr>`}</tbody></table></div>`;}
function dashStats(items){return `<div class="dash-kpis">${items.map(([label,value,unit,note])=>`<div class="dash-kpi"><div><span>${label}</span></div><strong>${value}<small>${unit}</small></strong><p>${note}</p></div>`).join('')}</div>`;}
function dashDates(){return Array.from({length:7},(_,i)=>{const d=new Date(DEMO_DATE+'T00:00:00Z');d.setUTCDate(d.getUTCDate()-6+i);return d.toISOString().slice(0,10);});}
const dashRange=()=>dashDates()[0]+' — '+DEMO_DATE;
export function dashboardOperations(v){const profile=productProfiles[v.dashProduct];return profile?profile.features.map(r=>({...r,product:v.dashProduct,used:r.daily.reduce((a,b)=>a+b,0)})):[];}
export function dashboardCustomers(s,v){
  const es=s.entitlements.filter(e=>dashSelected(v,e.product));
  const active=es.filter(e=>['使用中','即將到期'].includes(serviceStatus(s,e).label));
  const ids=v.dashProduct&&v.dashProduct!=='all'?new Set(es.map(e=>e.company)):new Set(s.companies.map(c=>c.id));
  return {es,active,companies:s.companies.filter(c=>ids.has(c.id)),effective:dashUnique(active.map(e=>e.company)),due:active.filter(e=>serviceStatus(s,e).label==='即將到期'),waiting:es.filter(e=>e.stage==='等待開通')};
}
function productHealth(s,p){
 const profile=productProfiles[p.id];
 if(!p.enabled)return {label:'服務已停用',tone:'bad',note:'此產品的全域開關已關閉。'};
 if(!profile)return {label:'尚未提供監控',tone:'warn',note:'尚無此產品的服務監控資料。'};
 const stopped=s.features.filter(f=>f.product===p.id&&(!f.enabled||f.status==='維護中'));
 return {label:stopped.length?'部分功能維護／停用':profile.health,tone:stopped.length||profile.health!=='服務正常'?'warn':'ok',note:profile.description+(stopped.length?` ${stopped.length} 項功能維護或停用。`:'')};
}
function productIssues(s,products){
 const rows=products.flatMap(p=>(productProfiles[p.id]?.issues||[]).map(issue=>`<div class="ops-event"><span class="product-label">${esc(p.name)}</span><div><b>${esc(issue.title)}</b><p>${esc(issue.state)} · 負責人 ${esc(issue.owner)} · ${esc(issue.note)}</p><p>涉及客戶：${issue.companies.map(id=>link(companyOf(s,id).short,'company',`data-id="${id}" data-product="${p.id}"`)).join('、')}</p></div>${dashControl('查看產品','dashProduct',p.id,false)}</div>`)).join('');
 return dashPanel('需要關注的事項','集中看問題與處理進度；細節仍回到所屬產品。',rows||'<p class="dash-empty">尚無此產品的事件資料。</p>');
}
function featureTrend(r){
 const dates=dashDates(),max=Math.max(...r.daily,1);
 return `<div class="ops-trend-summary"><strong>${dashFmt(r.used)} ${r.unit}</strong><span>${dashRange()} · 七天使用量合計</span></div><div class="chart-container"><svg viewBox="0 0 660 220" role="img" aria-label="${esc(r.name)}每日使用量，單位${r.unit}">${[0,1,2,3].map(i=>`<line class="chart-grid" x1="45" x2="640" y1="${175-i*48}" y2="${175-i*48}"/><text x="37" y="${179-i*48}" text-anchor="end">${dashFmt(Math.round(max*i/3))}</text>`).join('')}${r.daily.map((n,i)=>`<rect x="${65+i*82}" y="${175-n/max*144}" width="42" height="${n/max*144}" rx="4" fill="#277f81" opacity="${.5+i*.07}"><title>${dates[i]}：${n} ${r.unit}</title></rect><text x="${86+i*82}" y="202" text-anchor="middle">${dates[i].slice(5).replace('-','/')}</text>`).join('')}</svg></div>`;
}
function productDashboard(s,v){
 const selected=s.products.find(p=>p.id===v.dashProduct);
 if(!selected){
  const rows=s.products.map(p=>{const h=productHealth(s,p),profile=productProfiles[p.id],active=dashboardCustomers(s,{dashProduct:p.id}).effective;return `<tr><td><b>${esc(p.name)}</b><small>${esc(p.description||'')}</small></td><td>${status(h.label,h.tone)}</td><td>${active} 間</td><td>${profile?`${profile.companies.length} 間`:'尚未提供'}<small>${profile?esc(profile.definition):'使用行為與資料待設定'}</small></td><td>${profile?profile.issues.map(x=>esc(x.title)).join('<br>')||'無待處理事項':'尚未提供'}</td><td>${dashControl('查看概況','dashProduct',p.id,false)}</td></tr>`;}).join('');
  return `<div class="ops-section-heading"><div><span class="ops-eyebrow">PRODUCT OVERVIEW</span><h2>各產品目前的營運狀況</h2></div><span>近期使用：${dashRange()}</span></div>${dashPanel('產品概況','有效客戶看目前服務；近期使用看各產品自己的使用行為。',dashTable(['產品','服務狀況','有效客戶公司','近期使用公司','需關注事項',''],rows))}<p class="chart-footnote">每個產品各自計算公司數，不跨產品加總；功能用量與資源消耗請選擇產品後查看。</p>${productIssues(s,s.products)}`;
 }
 const p=selected,profile=productProfiles[p.id],health=productHealth(s,p),rows=dashboardOperations(v);
 const intro=`<div class="ops-section-heading"><div><span class="ops-eyebrow">PRODUCT DETAIL</span><h2>${esc(p.name)} · 營運概況</h2></div>${dashControl('← 全部產品','dashProduct','all',false)}</div>`;
 const service=`<div class="ops-service"><div><b>${esc(p.name)}</b>${status(health.label,health.tone)}</div><p>${esc(health.note)}</p><div class="ops-service-values"><span>目前有效客戶公司<b>${dashboardCustomers(s,{dashProduct:p.id}).effective} 間</b></span><span>近七天使用公司<b>${profile?profile.companies.length+' 間':'尚未提供'}</b></span></div><p>${profile?esc(profile.definition):'尚未定義此產品的近期使用行為。'}</p>${link('管理產品與功能 →','product',`data-id="${p.id}"`)}</div>`;
 if(!profile)return intro+dashPanel('服務狀況','未提供資料不代表服務正常或使用量為零。',service)+`<div class="ops-spaced">${dashPanel('功能使用與資源消耗','此產品尚未提供專屬指標。','<p class="dash-empty">設定此產品適合的功能、單位與資料後，即可在這裡查看；不套用其他產品的 AI 或網站指標。</p>')}</div>`;
 const featureRows=[...rows].sort((a,b)=>b.companies.length-a.companies.length).map(r=>`<tr><td><b>${esc(r.name)}</b></td><td>${r.companies.length} 間</td><td>${dashFmt(r.used)} ${r.unit}</td><td>${dashControl('查看每日用量','dashFeature',r.id,v.dashFeature===r.id)}</td></tr>`).join('');
 const chosen=rows.find(r=>r.id===v.dashFeature)||rows[0];
 const resourceGroups=[...new Set(rows.map(r=>r.resourceUnit))];
 const resources=resourceGroups.map(unit=>{const list=rows.filter(r=>r.resourceUnit===unit).sort((a,b)=>b.amount-a.amount),max=Math.max(...list.map(r=>r.amount),1);return `<div class="ops-resource-group"><h3>${esc(unit)} <small>同單位比較</small></h3>${list.map(r=>`<div class="ops-rank-row"><span class="ops-rank-name"><b>${esc(r.name)}</b><small>${esc(r.resource)}</small></span><span class="horizontal-track teal"><i style="width:${r.amount/max*100}%"></i></span><strong>${dashFmt(r.amount)} ${esc(unit)}</strong></div>`).join('')}</div>`;}).join('');
 const unavailableFeatures=s.features.filter(f=>f.product===p.id&&(!f.enabled||f.status==='維護中'));
 const featureStates=unavailableFeatures.length?`<div class="ops-detail-copy"><p>目前維護／停用：${unavailableFeatures.map(f=>esc(f.name)).join('、')}。歷史使用量仍保留。</p></div>`:'';
 return intro+dashPanel('服務狀況','目前狀態 · 規劃展示',service+featureStates)+`<div class="ops-spaced">${productIssues(s,[p])}</div>`+dashPanel('功能使用概況',`${dashRange()} · 依使用公司數排序，不混合不同功能的計量單位。`,dashTable(['功能','曾使用公司','七天使用量',''],featureRows))+`<div class="dash-row-grid ops-spaced"><div id="dashboard-feature-detail">${dashPanel(esc(chosen.name)+' · 每日用量','以明確日期查看單一功能。',featureTrend(chosen)+`<div class="ops-detail-copy"><p>使用公司：${chosen.companies.map(id=>link(companyOf(s,id).short,'company',`data-id="${id}" data-product="${p.id}"`)).join('、')}</p><p>${esc(chosen.note)}</p></div>`)}</div>${dashPanel('資源消耗',`${dashRange()} · 各單位分開呈現，未換算金額。`,resources)}</div>`+releasePanel(s,v);
}

function releasePanel(s,v){const rows=s.releases.filter(r=>dashSelected(v,r.product)).slice(0,3).map(r=>`<tr><td>${link(r.name,'release',`data-id="${r.id}"`)}</td><td>${productOf(s,r.product).name}</td><td>${esc(r.version)}</td><td>${status(r.status)}</td><td>${esc(r.time)}</td></tr>`).join('');return dashPanel('最近發布與變更','目前最新紀錄 · 可用來對照異常發生時間',dashTable(['發布項目','產品','版本','狀態','時間'],rows),link('所有發布 →','releases'));}
function customerDashboard(s,v){
  const {es,active,companies,effective,due,waiting}=dashboardCustomers(s,v);
  const qs=s.quotas.filter(q=>dashSelected(v,q.product));

  const groups=new Map();companies.forEach(c=>{const names=[...new Set(active.filter(e=>e.company===c.id).map(e=>productOf(s,e.product).name))].sort();const label=names.length?names.join('＋'):'目前無有效產品';groups.set(label,(groups.get(label)||0)+1);});
  const combinations=[...groups];const colors=['#327ac1','#238f88','#9a85b7','#c0c9d1'];
  const composition=`<div class="ops-composition">${combinations.map(([l,n],i)=>`<span style="width:${companies.length?n/companies.length*100:0}%;background:${colors[i%colors.length]}" title="${esc(l)} ${n} 間"></span>`).join('')}</div><div class="ops-combo-list">${combinations.map(([l,n],i)=>`<div><i style="background:${colors[i%colors.length]}"></i><span>${esc(l)}</span><b>${n} 間</b></div>`).join('')}</div><p class="chart-footnote">依所選產品的有效服務分類，每家公司只計一次；無有效產品不等於公司停用。</p>`;
  const productRows=s.products.filter(p=>dashSelected(v,p.id)).map(p=>{const pe=es.filter(e=>e.product===p.id);return `<tr><td>${link(p.name,'product',`data-id="${p.id}"`)}</td><td>${dashUnique(active.filter(e=>e.product===p.id).map(e=>e.company))}</td><td>${due.filter(e=>e.product===p.id).length}</td><td>${pe.filter(e=>serviceStatus(s,e).label==='已到期').length}</td><td>${pe.filter(e=>serviceStatus(s,e).label.includes('暫停')||serviceStatus(s,e).label==='產品全域停用').length}</td><td>${pe.filter(e=>['等待開通','尚未開始'].includes(serviceStatus(s,e).label)).length}</td></tr>`;}).join('');
  const attention=es.map(e=>({e,st:serviceStatus(s,e),n:seats(s,e)})).filter(({st,n})=>st.label!=='使用中'||n.used>=n.limit);
  const attentionRows=attention.map(({e,st,n})=>`<tr><td>${link(companyOf(s,e.company).short,'company',`data-id="${e.company}" data-product="${e.product}"`)}</td><td>${productOf(s,e.product).name}</td><td>${status(st.label,st.tone)}${n.used>=n.limit?'<small>帳號名額已滿</small>':''}</td><td>${e.end}<small>${daysUntil(e.end)<0?'已超過到期日':`剩餘 ${daysUntil(e.end)} 天`}</small></td><td>${n.used} / ${n.limit}</td><td>${link('查看公司 →','company',`data-id="${e.company}" data-product="${e.product}"`)}</td></tr>`).join('');
  const quotaRows=[...qs].sort((a,b)=>b.used/b.total-a.used/a.total).map(q=>`<button class="quota-chart-row" data-action="quotaEdit" data-id="${q.id}"><div><b>${companyOf(s,q.company).short}</b><small>${q.name} · ${q.used}/${q.total} ${q.unit}</small></div><div class="horizontal-track ${q.used/q.total>=.85?'amber':'teal'}"><i style="width:${Math.min(100,q.used/q.total*100)}%"></i></div><strong>${Math.round(q.used/q.total*100)}%</strong></button>`).join('');
  const tasks=s.tasks.filter(t=>t.state!=='已處理'&&dashSelected(v,t.product));
  const taskRows=tasks.slice(0,5).map(t=>`<div class="dash-task"><span class="priority ${t.priority==='高'?'high':''}">${esc(t.priority)}</span><div><b>${esc(t.title)}</b><p>${esc(t.desc)}</p></div>${btn('處理','task',`data-id="${t.id}"`,'small ghost')}</div>`).join('');
  return `<div class="ops-section-heading"><div><span class="ops-eyebrow">CUSTOMER OPERATIONS</span><h2>哪些客戶正在使用，哪些需要協助？</h2></div><span>目前狀態 · 同公司去重計算</span></div>${dashStats([['客戶公司',companies.length,'間','目前所選產品關聯公司'],['有效服務公司',effective,'間','至少一項所選產品有效；含即將到期'],['30 天內到期',dashUnique(due.map(e=>e.company)),'間',`${due.length} 項有效產品服務即將到期`],['等待開通',dashUnique(waiting.map(e=>e.company)),'間',`${waiting.length} 項已申請服務；不含未購買產品`]])}<div class="dash-chart-grid">${dashPanel('各產品的客戶服務狀態','有效含即將到期；同公司可分別使用兩個產品，跨產品不可直接加總。',dashTable(['產品','有效公司','其中快到期','已到期','暫停／停用','待開通／開始'],productRows),link('客戶公司 →','companies',`data-product-filter="${v.dashProduct||'all'}"`))}${dashPanel('客戶的產品組合','目前有效服務 · 公司數',composition)}</div>${dashPanel('優先關注的客戶','到期、停用、等待開通或名額已滿；點入公司可繼續處理。',dashTable(['公司','產品','狀態／提醒','到期日','已占名額',''],attentionRows))}${careSummary(s,v)}<div class="dash-row-grid ops-spaced">${dashPanel('客戶額度使用','目前配額週期 · 客戶額度不等於內部資源成本。',quotaRows||'<p class="dash-empty">尚無配額資料</p>',link('用量明細 →','quotas'))}${dashPanel('營運待辦',`${tasks.length} 件未處理 · 依所選產品篩選`,taskRows||'<p class="dash-empty">沒有待處理事項</p>',link('全部待辦 →','tasks'))}</div>`;
}
export function dashboard(s,v){
  const mode=v.dashMode||'product',product=v.dashProduct||'all';
  return `<div class="dashboard operations-dashboard"><div class="ops-toolbar"><div class="ops-view-switch" role="group" aria-label="Dashboard視角">${dashControl('產品總覽','dashMode','product',mode==='product')}${dashControl('客戶總覽','dashMode','customer',mode==='customer')}</div><div class="dashboard-context"><div><select aria-label="Dashboard產品" data-view="dashProduct"><option value="all" ${product==='all'?'selected':''}>全部產品</option>${s.products.map(p=>`<option value="${p.id}" ${product===p.id?'selected':''}>${esc(p.name)}</option>`).join('')}</select><span>目前狀態</span></div></div></div><div class="ops-demo-note"><b>規劃展示</b><span>展示基準 ${DEMO_DATE}；服務狀態與功能使用為規劃範例，非即時監控。</span></div>${mode==='product'?productDashboard(s,v):customerDashboard(s,v)}<details class="ops-definitions"><summary>資料說明</summary><p>服務狀況與有效客戶為目前狀態；近期使用固定查看 ${dashRange()} 七天。各產品定義自己的使用行為，尚未提供數據不等於零。</p><p>同公司可使用多個產品，各列公司數不可直接相加。功能次數、張數、分鐘與 Token 分開呈現；只在同單位內比較資源消耗。</p><p>本版不呈現跨產品任務合計、成功率或估算金額。新增產品未設定監控與使用資料時，明確顯示尚未提供。</p></details></div>`;
}

