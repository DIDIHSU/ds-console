export const DEMO_DATE = '2026-10-05';
export const products = [
  {id:'e2b',name:'E2B',code:'E2B',description:'企業資料、分析與內容營運',version:'v2.8.3',enabled:true,status:'運行正常',owner:'林怡君',billing:'公司訂閱',updated:'2026-10-04 16:40'},
  {id:'web',name:'官網方案',code:'WEBSITE',description:'品牌網站與內容發布服務',version:'v1.6.0',enabled:true,status:'運行正常',owner:'張凱文',billing:'公司合約',updated:'2026-10-03 10:20'}
];
export const plans = [
  {id:'plan-e10',product:'e2b',name:'E2B · 10 席方案',limit:10,note:'方案名稱與席次為展示資料'},
  {id:'plan-e5',product:'e2b',name:'E2B · 5 席方案',limit:5,note:'方案名稱與席次為展示資料'},
  {id:'plan-e3',product:'e2b',name:'E2B · 3 席方案',limit:3,note:'方案名稱與席次為展示資料'},
  {id:'plan-w5',product:'web',name:'官網 · 合約 5 席',limit:5,note:'依合約配置；名稱與席次為展示資料'},
  {id:'plan-w3',product:'web',name:'官網 · 合約 3 席',limit:3,note:'依合約配置；名稱與席次為展示資料'}
];
export const companies = [
  ['c1','遠星科技股份有限公司','遠星科技','科技服務','林怡君','陳柏宇',true,'E2B 與官網使用者分別管理。'],
  ['c2','綠沐生活有限公司','綠沐生活','生活零售','張凱文','李佳玲',true,'官網合約將到期，發布額度接近上限。'],
  ['c3','晨港物流股份有限公司','晨港物流','物流運輸','王小明','周庭安',true,'E2B 名額已滿，另有停用帳號。'],
  ['c4','星河教育科技','星河教育','教育服務','何志偉','黃子軒',true,'參與指定功能測試。'],
  ['c5','森野食品有限公司','森野食品','食品製造','陳雅婷','吳怡萱',true,'官網使用權已到期；公開網站處置政策尚待確認。'],
  ['c6','曜石工業股份有限公司','曜石工業','工業製造','林怡君','林志遠',false,'整間公司暫停，兩個產品帳號皆不可使用。'],
  ['c7','禾境設計有限公司','禾境設計','設計服務','張凱文','張語安',true,'使用暖白品牌樣式與圖文交錯版型。'],
  ['c8','北辰醫材股份有限公司','北辰醫材','醫材供應','王小明','許承恩',true,'E2B 使用權暫停，官網仍正常使用。']
].map(([id,name,short,industry,owner,contact,enabled,note],i)=>({id,name,short,industry,owner,contact,enabled,note,code:`DS-100${i+1}`,email:`contact${i+1}@client.example`,updated:'2026-10-05'}));
export const entitlements = [
  ['en1','c1','e2b','plan-e10','2026-03-01','2027-02-28',true,'已付款'],
  ['en2','c1','web','plan-w5','2026-01-01','2026-09-30',true,'已付款'],
  ['en3','c2','web','plan-w3','2025-10-22','2026-10-21',true,'已付款'],
  ['en4','c3','e2b','plan-e3','2026-07-01','2027-06-30',true,'已付款'],
  ['en5','c4','e2b','plan-e5','2026-04-01','2027-03-31',true,'已付款'],
  ['en6','c5','web','plan-w3','2025-09-01','2026-08-31',true,'已付款'],
  ['en7','c6','e2b','plan-e5','2026-02-01','2027-01-31',true,'付款逾期'],
  ['en8','c6','web','plan-w3','2026-02-01','2027-01-31',true,'已付款'],
  ['en9','c7','web','plan-w5','2026-06-01','2027-05-31',true,'已付款'],
  ['en10','c8','e2b','plan-e5','2026-01-16','2027-01-15',false,'已付款'],
  ['en11','c8','web','plan-w3','2026-05-01','2027-04-30',true,'已付款']
].map(([id,company,product,plan,start,end,enabled,payment])=>({id,company,product,plan,start,end,enabled,payment}));
const accountNames = ['陳柏宇','李思妤','周庭安','黃子軒','吳怡萱','林志遠','張語安','許承恩','郭育廷','何佳蓉'];
export const users = entitlements.flatMap((e,i) => {
  const count = [6,2,2,2,3,2,3,2,3,2,2][i];
  const rows = Array.from({length:count},(_,j)=>({id:`u-${e.id}-${j}`,company:e.company,product:e.product,name:accountNames[(i+j)%accountNames.length],email:`${e.product}.user${i+1}${j+1}@client.example`,role:j===0?'公司管理員':'一般用戶',status:'啟用',lastLogin:`2026-10-0${5-j%3} ${j%2?'09:40':'14:20'}`}));
  if ([0,2,3,4,8].includes(i)) rows.push({id:`invite-${e.id}`,company:e.company,product:e.product,name:'待接受邀請',email:`invite${i+1}@client.example`,role:'一般用戶',status:'邀請中',lastLogin:'尚未登入'});
  rows.push({id:`off-${e.id}`,company:e.company,product:e.product,name:accountNames[(i+6)%accountNames.length],email:`former${i+1}@client.example`,role:'一般用戶',status:'停用',lastLogin:'2026-09-18 11:32'});
  return rows;
});
const featureSeed = [
  ['e2b','Data Hub','DATA_HUB','已釋出','全部客戶',true],
  ['e2b','營運分析中心','OPERATIONS','已釋出','全部客戶',true],
  ['e2b','商品分析','PRODUCT_ANALYTICS','已釋出','全部客戶',true],
  ['e2b','客群管理','AUDIENCE','已釋出','全部客戶',true],
  ['e2b','廣告效益分析','AD_ANALYTICS','已釋出','全部客戶',true],
  ['e2b','社群影音分析','SOCIAL_VIDEO','指定客戶測試','指定客戶',true],
  ['e2b','創意與文案中心','CREATIVE','已釋出','全部客戶',true],
  ['e2b','AI 商品文案生成','AI_COPY','已釋出','全部客戶',true],
  ['e2b','AI 商品圖片生成','AI_IMAGE','維護中','全部客戶',false],
  ['e2b','資產庫','ASSETS','已釋出','全部客戶',true],
  ['e2b','全域洞察與決策中心','INSIGHTS','內部測試','僅內部測試',true],
  ['web','官網基本設定','SITE_SETTINGS','已釋出','全部客戶',true],
  ['web','頁面管理','PAGES','已釋出','全部客戶',true],
  ['web','選單管理','MENU','已釋出','全部客戶',true],
  ['web','最新消息','NEWS','已釋出','全部客戶',true],
  ['web','商品管理','CATALOG','已釋出','全部客戶',true],
  ['web','表單管理','FORMS','已釋出','全部客戶',true],
  ['web','SEO 設定','SEO','已釋出','全部客戶',true],
  ['web','自訂網域','DOMAIN','已釋出','全部客戶',true],
  ['web','品牌樣式套用','BRAND_APPLY','已釋出','全部客戶',true],
  ['web','內容版型套用','BLOCK_APPLY','指定客戶測試','指定客戶',true]
];
export const features = featureSeed.map(([product,name,code,status,scope,enabled],i)=>({id:`f${i+1}`,product,name,code,status,scope,enabled,version:i===5?'v0.9.8':'v1.2.0',clients:['c1','c4','c7'],owner:product==='e2b'?'林怡君':'張凱文',description:`${name}的客戶開放與使用設定。`}));
export const overrides = [{company:'c4',feature:'f5',mode:'強制關閉',reason:'客戶目前不使用廣告分析',start:'2026-10-01',end:'2026-12-31'}];
export const brands = [
  {id:'b1',name:'澄藍 · 科技品牌',code:'BRAND-001',version:'v1.4.2',status:'已發布',color:'#185b79',font:'Noto Sans TC',description:'清晰而沉穩的科技品牌語言',owner:'張凱文',updated:'2026-10-04',versions:['v1.4.2','v1.4.1','v1.3.0']},
  {id:'b2',name:'暖白 · 生活品牌',code:'BRAND-002',version:'v1.2.0',status:'已發布',color:'#766548',font:'Noto Serif TC',description:'溫暖留白與自然的文字節奏',owner:'陳雅婷',updated:'2026-10-02',versions:['v1.2.0','v1.1.0']},
  {id:'b3',name:'墨綠 · 專業服務',code:'BRAND-003',version:'v1.0.0',status:'測試中',color:'#216357',font:'Noto Sans TC',description:'沉穩色彩與直接的資訊層級',owner:'張凱文',updated:'2026-10-05',versions:['v1.0.0']}
];
export const blocks = [
  {id:'bl1',name:'服務入口 · 卡片列表',code:'BLOCK-SERVICE-A',version:'v1.2.0',status:'已發布',category:'服務入口',layout:'三欄列表',description:'服務標題、摘要與連結',owner:'陳雅婷',updated:'2026-10-03',versions:['v1.2.0','v1.1.0']},
  {id:'bl2',name:'品牌故事 · 圖文交錯',code:'BLOCK-STORY-A',version:'v1.1.0',status:'已發布',category:'品牌故事',layout:'圖文交錯',description:'標題、內文與可替換圖片',owner:'張凱文',updated:'2026-10-02',versions:['v1.1.0','v1.0.0']},
  {id:'bl3',name:'聯絡我們 · 表單區塊',code:'BLOCK-CONTACT-A',version:'v0.9.0',status:'檢查失敗',category:'聯絡表單',layout:'雙欄表單',description:'聯絡資訊與表單欄位',owner:'陳雅婷',updated:'2026-10-05',versions:['v0.9.0']}
];
export const websites = [
  ['w1','c1','遠星科技官網','yuanxing.example','b1',['bl1','bl2'],'v1.4.2'],
  ['w2','c2','綠沐生活官網','green.example','b2',['bl1','bl2'],'v1.2.0'],
  ['w3','c5','森野食品官網','forest.example','b2',['bl2'],'v1.2.0'],
  ['w4','c6','曜石工業官網','obsidian.example','b1',['bl1'],'v1.4.2'],
  ['w5','c7','禾境設計官網','design.example','b2',['bl1','bl2'],'v1.2.0'],
  ['w6','c8','北辰醫材官網','north.example','b1',['bl1'],'v1.4.2']
].map(([id,company,name,domain,brand,blocks,version])=>({id,company,name,domain,brand,blocks,version,updated:'2026-10-04'}));
export const quotas = [
  ['q1','c1','e2b','AI 文案生成','f8',720,1000,'次'],
  ['q2','c2','web','網站發布',null,46,50,'次'],
  ['q3','c3','e2b','AI 文案生成','f8',200,200,'次'],
  ['q4','c4','e2b','AI 文案生成','f8',98,500,'次'],
  ['q5','c7','web','網站發布',null,12,50,'次'],
  ['q6','c8','e2b','AI 文案生成','f8',40,500,'次']
].map(([id,company,product,name,feature,used,total,unit])=>({id,company,product,name,feature,used,total,unit,reset:'2026-11-01'}));
export const releases = [
  {id:'r1',name:'澄藍品牌樣式細節調整',product:'web',type:'品牌樣式',asset:'b1',version:'v1.4.3',scope:'所有採用網站',status:'待發布',time:'2026-10-06 10:00',owner:'張凱文',description:'調整全站標題字級、按鈕與表單焦點樣式。'},
  {id:'r2',name:'社群影音分析測試',product:'e2b',type:'功能發布',asset:'f6',version:'v0.9.8',scope:'指定客戶',status:'測試中',time:'2026-10-05 14:00',owner:'林怡君',description:'指定遠星科技與星河教育進行測試。'},
  {id:'r3',name:'服務入口版型更新',product:'web',type:'內容版型',asset:'bl1',version:'v1.2.0',scope:'指定客戶',status:'已發布',time:'2026-10-03 16:30',owner:'陳雅婷',description:'調整內容欄位與連結結構。'},
  {id:'r4',name:'E2B 資料映射修正',product:'e2b',type:'產品版本',asset:'e2b',version:'v2.8.3',scope:'全部客戶',status:'已發布',time:'2026-10-02 18:00',owner:'林怡君',description:'修正 Data Hub 欄位映射。'}
];
export const notifications = [
  {id:'n1',name:'官網合約到期提醒',company:'c2',product:'web',channel:'Email',status:'待發送',time:'2026-10-06 09:00',content:'您好，貴公司的官網服務使用權將於 2026-10-21 到期，請聯繫服務窗口確認後續安排。'},
  {id:'n2',name:'品牌樣式更新公告',company:'all-brand',product:'web',channel:'Email／站內通知',status:'草稿',time:'尚未排程',content:'您好，澄藍品牌樣式將同步更新所有採用網站的整體視覺。'},
  {id:'n3',name:'E2B 功能維護公告',company:'c1',product:'e2b',channel:'站內通知',status:'已發送',time:'2026-10-04 10:00',content:'AI 商品圖片生成目前維護中，其他 E2B 功能仍可使用。'},
  {id:'n4',name:'額度接近上限提醒',company:'c2',product:'web',channel:'Email',status:'發送失敗',time:'2026-10-05 09:10',content:'貴公司網站發布額度已使用 46 / 50 次。',error:'展示情境：收件伺服器暫時拒收'}
];
export const logs = [
  ['l1','2026-10-05 14:20','王小明','用戶管理','停用帳號','晨港物流／E2B','帳號啟用，占用 1 席','帳號停用，釋放 1 席','職員離職，由公司管理員提出申請'],
  ['l2','2026-10-04 16:40','張凱文','品牌樣式','發布品牌樣式','澄藍 · 科技品牌','v1.4.1','v1.4.2；所有採用網站同步更新','修正全站文字對比與按鈕樣式'],
  ['l3','2026-10-03 11:20','林怡君','產品使用權','暫停單一產品','北辰醫材／E2B','E2B 使用權有效','E2B 暫停；官網仍有效','客戶提出暫停申請'],
  ['l4','2026-10-02 15:30','王小明','公司管理','暫停整間公司','曜石工業','公司正常','公司暫停；E2B 與官網帳號不可用','服務異常待確認'],
  ['l5','2026-10-01 10:00','張凱文','產品使用權','使用權到期','遠星科技／官網','官網使用權有效','官網帳號不可使用；E2B 不受影響','官網合約服務期間到期']
].map(([id,time,actor,module,action,target,before,after,reason])=>({id,time,actor,module,action,target,before,after,reason}));
export const staff = [
  {id:'s1',name:'王小明',email:'admin@demo.local',role:'系統管理員',scope:'全系統',status:'啟用',actions:['檢視','編輯','發布','停用','系統管理']},
  {id:'s2',name:'林怡君',email:'pm@demo.local',role:'產品營運',scope:'E2B',status:'啟用',actions:['檢視','編輯','發布']},
  {id:'s3',name:'張凱文',email:'web@demo.local',role:'官網維運',scope:'官網方案',status:'啟用',actions:['檢視','編輯','發布']},
  {id:'s4',name:'陳雅婷',email:'review@demo.local',role:'檢視人員',scope:'全系統',status:'啟用',actions:['檢視']}
];
export function seedState() { return structuredClone({products,plans,companies,entitlements,users,features,overrides,brands,blocks,websites,quotas,releases,notifications,logs,staff}); }
