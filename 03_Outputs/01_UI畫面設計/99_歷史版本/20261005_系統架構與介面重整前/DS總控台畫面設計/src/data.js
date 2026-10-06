export const statusMeta = {
  "已上線": ["ok", "CircleCheck"],
  "已釋出": ["ok", "CircleCheck"],
  "啟用": ["ok", "CircleCheck"],
  "使用中": ["ok", "CircleCheck"],
  "正常": ["ok", "CircleCheck"],
  "維護中": ["warn", "TriangleAlert"],
  "即將到期": ["warn", "Clock"],
  "等待開通": ["warn", "Clock"],
  "內部測試": ["info", "FlaskConical"],
  "指定客戶測試": ["info", "Users"],
  "開發中": ["info", "Code2"],
  "規劃中": ["info", "Map"],
  "試用中": ["info", "Sparkles"],
  "停權": ["bad", "OctagonX"],
  "停止服務": ["bad", "OctagonX"],
  "已下架": ["bad", "ArchiveX"],
  "已到期": ["bad", "CalendarX"],
  "檢查失敗": ["bad", "FileWarning"]
};

export const products = [
  {
    id: "p-e2b",
    name: "E2B",
    code: "E2B",
    icon: "E",
    desc: "企業營運與資料交換管理平台，支援 Data Hub、商品、訂單與 AI 內容流程。",
    version: "v2.8.3",
    status: "已上線",
    enabled: true,
    featureCount: 7,
    customers: 128,
    owner: "林怡君",
    updatedAt: "2026-08-12 16:40",
    maintenanceStart: "",
    recoveryAt: "",
    notice: "本週無重大維護。"
  },
  {
    id: "p-web",
    name: "官網方案",
    code: "WEB_PLAN",
    icon: "W",
    desc: "公司官網品牌樣式、內容版型上傳、檢查、測試與發布管理服務。",
    version: "v1.6.0",
    status: "維護中",
    enabled: true,
    featureCount: 6,
    customers: 86,
    owner: "張凱文",
    updatedAt: "2026-08-13 09:12",
    maintenanceStart: "2026-08-13 09:00",
    recoveryAt: "2026-08-13 18:00",
    notice: "內容版型檢查服務調整中，已通知受影響客戶。"
  }
];

export const features = [
  ["Data Hub", "DATA_HUB", "E2B", "v2.4.1", "已釋出", "全部客戶", 118, true, "2026-08-12 15:30", "林怡君"],
  ["商品內容管理", "PRODUCT_CMS", "E2B", "v2.7.0", "已釋出", "全部客戶", 126, true, "2026-08-10 11:18", "林怡君"],
  ["AI 商品內容建議", "AI_PRODUCT_HINT", "E2B", "v0.9.8", "指定客戶測試", "指定客戶", 12, true, "2026-08-08 14:20", "何志偉"],
  ["訂單同步", "ORDER_SYNC", "E2B", "v1.9.2", "維護中", "全部客戶", 94, false, "2026-08-13 08:55", "王小明"],
  ["官網樣式與版型上傳", "WEBSITE_ASSET_UPLOAD", "官網方案", "v1.2.0", "已釋出", "全部客戶", 81, true, "2026-08-09 10:05", "張凱文"],
  ["HTML 自動檢查", "HTML_CHECK", "官網方案", "v1.5.4", "維護中", "全部客戶", 78, false, "2026-08-13 09:25", "張凱文"],
  ["樣式與版型預覽測試", "WEBSITE_PREVIEW", "官網方案", "v1.3.2", "內部測試", "內部", 0, true, "2026-08-11 18:04", "陳雅婷"],
  ["版本發布排程", "RELEASE_SCHEDULE", "官網方案", "v1.1.1", "已釋出", "全部客戶", 68, true, "2026-08-07 13:55", "陳雅婷"]
].map(([name, code, product, version, status, scope, customers, enabled, updatedAt, owner], i) => ({
  id: `f-${i + 1}`, name, code, product, version, status, scope, customers, enabled, updatedAt, owner,
  desc: `${name} 的設定、測試與發布控制。`, plannedAt: "2026-08-20 10:00", notice: "依產品維護公告同步顯示。"
}));

export const templates = [
  ["品牌樣式", "高端品牌科技型", "STYLE-TECH-001", "v1.4.2", "已上線", "全站樣式", "通過", 28, "2026-08-12 12:10", "專業藍綠"],
  ["品牌樣式", "品牌故事長頁版", "STYLE-BRAND-009", "v1.1.0", "等待開通", "品牌樣式", "通過", 13, "2026-08-11 17:40", "溫暖敘事"],
  ["品牌樣式", "活動檔期促銷版", "STYLE-CAMPAIGN-018", "v0.8.7", "檢查失敗", "活動樣式", "CSS 缺少必要檔案", 5, "2026-08-13 10:02", "高對比促銷"],
  ["內容版型", "服務入口｜卡片列表｜版型 A", "BLOCK-SERVICE-CARD-A", "v1.0.0", "已上線", "卡片列表", "通過", 18, "2026-08-13 11:20", "沉浸情境面板｜4 張卡"],
  ["內容版型", "服務入口｜卡片列表｜版型 B", "BLOCK-SERVICE-CARD-B", "v1.0.0", "內部測試", "卡片列表", "通過", 0, "2026-08-13 11:35", "錯落圖文卡片"],
  ["內容版型", "產品特色｜圖文交錯｜版型 A", "BLOCK-FEATURE-MIX-A", "v1.2.1", "已上線", "內容區塊", "通過", 24, "2026-08-09 15:25", "左右交錯圖文"]
].map(([category, name, code, version, status, type, check, customers, updatedAt, style], i) => ({
  id: `t-${i + 1}`, category, name, code, version, status, type, check, customers, updatedAt, style,
  html: category === "品牌樣式" ? "theme.json, tokens.css, preview.html, assets/" : "schema.json, block.html, block.css, preview.png",
  owner: i % 2 ? "陳雅婷" : "張凱文"
}));

export const customers = [
  ["遠星科技股份有限公司", "C-1001", "林怡君", "使用中", "E2B, 官網方案", "2027-02-28", 199, "72%", "正常"],
  ["綠沐生活有限公司", "C-1002", "張凱文", "即將到期", "官網方案", "2026-08-29", 16, "91%", "額度偏高"],
  ["晨港物流股份有限公司", "C-1003", "王小明", "等待開通", "E2B", "2026-11-30", 109, "18%", "待開通"],
  ["星河教育科技", "C-1004", "何志偉", "試用中", "E2B", "2026-08-22", 9, "48%", "試用追蹤"],
  ["森野食品", "C-1005", "陳雅婷", "已到期", "官網方案", "2026-08-05", -8, "100%", "已停用"],
  ["曜石工業", "C-1006", "林怡君", "停權", "E2B, 官網方案", "2026-10-01", 49, "63%", "付款逾期"],
  ["禾境設計", "C-1007", "張凱文", "使用中", "官網方案", "2026-09-06", 24, "82%", "正常"],
  ["北辰醫材", "C-1008", "王小明", "使用中", "E2B", "2027-01-15", 155, "56%", "正常"]
].map(([name, code, owner, status, products, expiresAt, daysLeft, quota, note], i) => ({
  id: `c-${i + 1}`, name, code, owner, status, products, expiresAt, daysLeft, quota, note,
  contact: ["陳柏宇", "李佳玲", "周庭安", "黃子軒"][i % 4],
  email: `contact${i + 1}@demo-client.tw`,
  template: i % 2 ? "品牌故事長頁版" : "企業形象標準版"
}));

export const releases = [
  ["E2B", "v2.8.3", "訂單同步錯誤修正", "全部客戶", "2026-08-12 18:30", "林怡君"],
  ["官網方案", "v1.6.0", "HTML 檢查規則更新", "指定客戶測試", "2026-08-13 09:00", "張凱文"],
  ["E2B", "v2.8.0", "Data Hub 欄位映射改善", "全部客戶", "2026-08-05 14:00", "王小明"],
  ["官網方案", "v1.5.4", "品牌樣式與內容版型結構驗證", "內部測試", "2026-08-01 11:20", "陳雅婷"]
].map(([product, version, item, scope, time, user], i) => ({ id: `r-${i + 1}`, product, version, item, scope, time, user }));

export const tasks = [
  ["內容版型檢查失敗", "活動檔期促銷版缺少 css/main.css", "高", "官網方案"],
  ["客戶即將到期", "綠沐生活有限公司 16 天後到期", "中", "客戶公司"],
  ["功能維護中", "訂單同步目前暫停開關", "高", "E2B"],
  ["等待開通", "晨港物流股份有限公司等待開通 E2B", "中", "產品使用權"],
  ["付款逾期", "曜石工業付款逾期 7 天", "高", "客戶公司"],
  ["額度不足", "綠沐生活已使用 91% 官網發布額度", "中", "使用量與額度"]
].map(([title, desc, priority, target], i) => ({ id: `task-${i + 1}`, title, desc, priority, target }));

export const logs = [
  ["2026-08-13 10:24", "王小明", "關閉 HTML 自動檢查功能", "HTML_CHECK"],
  ["2026-08-13 09:40", "張凱文", "更新官網方案維護公告", "WEB_PLAN"],
  ["2026-08-12 18:31", "林怡君", "發布 E2B v2.8.3", "E2B"],
  ["2026-08-12 15:10", "陳雅婷", "延長綠沐生活官網方案期限", "C-1002"],
  ["2026-08-11 16:42", "王小明", "新增內部帳號測試人員", "IAM"]
].map(([time, user, action, target], i) => ({ id: `l-${i + 1}`, time, user, action, target }));

export const nav = [
  ["總覽", [["營運儀表板", "dashboard"], ["操作說明", "guide"]]],
  ["產品與服務", [["產品管理", "products"], ["版本與發布", "releases"]]],
  ["客戶管理", [["客戶公司", "customers"]]],
  ["營運管理", [["使用量與額度", "usage"], ["通知管理", "notifications"], ["操作紀錄", "logs"]]],
  ["系統管理", [["內部帳號", "accounts"], ["系統設定", "settings"]]]
];
