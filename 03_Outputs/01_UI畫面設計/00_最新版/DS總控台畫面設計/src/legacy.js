export const legacySnapshot = {
  "products": [
    {
      "id": "p-e2b",
      "name": "E2B",
      "code": "E2B",
      "icon": "E",
      "desc": "企業營運與資料交換管理平台，支援 Data Hub、商品、訂單與 AI 內容流程。",
      "version": "v2.8.3",
      "status": "已上線",
      "enabled": true,
      "featureCount": 7,
      "customers": 128,
      "owner": "林怡君",
      "updatedAt": "2026-08-12 16:40",
      "maintenanceStart": "",
      "recoveryAt": "",
      "notice": "本週無重大維護。"
    },
    {
      "id": "p-web",
      "name": "官網方案",
      "code": "WEB_PLAN",
      "icon": "W",
      "desc": "公司官網品牌樣式、內容版型上傳、檢查、測試與發布管理服務。",
      "version": "v1.6.0",
      "status": "維護中",
      "enabled": true,
      "featureCount": 6,
      "customers": 86,
      "owner": "張凱文",
      "updatedAt": "2026-08-13 09:12",
      "maintenanceStart": "2026-08-13 09:00",
      "recoveryAt": "2026-08-13 18:00",
      "notice": "內容版型檢查服務調整中，已通知受影響客戶。"
    }
  ],
  "features": [
    {
      "id": "f-1",
      "name": "Data Hub",
      "code": "DATA_HUB",
      "product": "E2B",
      "version": "v2.4.1",
      "status": "已釋出",
      "scope": "全部客戶",
      "customers": 118,
      "enabled": true,
      "updatedAt": "2026-08-12 15:30",
      "owner": "林怡君",
      "desc": "Data Hub 的設定、測試與發布控制。",
      "plannedAt": "2026-08-20 10:00",
      "notice": "依產品維護公告同步顯示。"
    },
    {
      "id": "f-2",
      "name": "商品內容管理",
      "code": "PRODUCT_CMS",
      "product": "E2B",
      "version": "v2.7.0",
      "status": "已釋出",
      "scope": "全部客戶",
      "customers": 126,
      "enabled": true,
      "updatedAt": "2026-08-10 11:18",
      "owner": "林怡君",
      "desc": "商品內容管理 的設定、測試與發布控制。",
      "plannedAt": "2026-08-20 10:00",
      "notice": "依產品維護公告同步顯示。"
    },
    {
      "id": "f-3",
      "name": "AI 商品內容建議",
      "code": "AI_PRODUCT_HINT",
      "product": "E2B",
      "version": "v0.9.8",
      "status": "指定客戶測試",
      "scope": "指定客戶",
      "customers": 12,
      "enabled": true,
      "updatedAt": "2026-08-08 14:20",
      "owner": "何志偉",
      "desc": "AI 商品內容建議 的設定、測試與發布控制。",
      "plannedAt": "2026-08-20 10:00",
      "notice": "依產品維護公告同步顯示。"
    },
    {
      "id": "f-4",
      "name": "訂單同步",
      "code": "ORDER_SYNC",
      "product": "E2B",
      "version": "v1.9.2",
      "status": "維護中",
      "scope": "全部客戶",
      "customers": 94,
      "enabled": false,
      "updatedAt": "2026-08-13 08:55",
      "owner": "王小明",
      "desc": "訂單同步 的設定、測試與發布控制。",
      "plannedAt": "2026-08-20 10:00",
      "notice": "依產品維護公告同步顯示。"
    },
    {
      "id": "f-5",
      "name": "官網樣式與版型上傳",
      "code": "WEBSITE_ASSET_UPLOAD",
      "product": "官網方案",
      "version": "v1.2.0",
      "status": "已釋出",
      "scope": "全部客戶",
      "customers": 81,
      "enabled": true,
      "updatedAt": "2026-08-09 10:05",
      "owner": "張凱文",
      "desc": "官網樣式與版型上傳 的設定、測試與發布控制。",
      "plannedAt": "2026-08-20 10:00",
      "notice": "依產品維護公告同步顯示。"
    },
    {
      "id": "f-6",
      "name": "HTML 自動檢查",
      "code": "HTML_CHECK",
      "product": "官網方案",
      "version": "v1.5.4",
      "status": "維護中",
      "scope": "全部客戶",
      "customers": 78,
      "enabled": false,
      "updatedAt": "2026-08-13 09:25",
      "owner": "張凱文",
      "desc": "HTML 自動檢查 的設定、測試與發布控制。",
      "plannedAt": "2026-08-20 10:00",
      "notice": "依產品維護公告同步顯示。"
    },
    {
      "id": "f-7",
      "name": "樣式與版型預覽測試",
      "code": "WEBSITE_PREVIEW",
      "product": "官網方案",
      "version": "v1.3.2",
      "status": "內部測試",
      "scope": "內部",
      "customers": 0,
      "enabled": true,
      "updatedAt": "2026-08-11 18:04",
      "owner": "陳雅婷",
      "desc": "樣式與版型預覽測試 的設定、測試與發布控制。",
      "plannedAt": "2026-08-20 10:00",
      "notice": "依產品維護公告同步顯示。"
    },
    {
      "id": "f-8",
      "name": "版本發布排程",
      "code": "RELEASE_SCHEDULE",
      "product": "官網方案",
      "version": "v1.1.1",
      "status": "已釋出",
      "scope": "全部客戶",
      "customers": 68,
      "enabled": true,
      "updatedAt": "2026-08-07 13:55",
      "owner": "陳雅婷",
      "desc": "版本發布排程 的設定、測試與發布控制。",
      "plannedAt": "2026-08-20 10:00",
      "notice": "依產品維護公告同步顯示。"
    }
  ],
  "templates": [
    {
      "id": "t-1",
      "category": "品牌樣式",
      "name": "高端品牌科技型",
      "code": "STYLE-TECH-001",
      "version": "v1.4.2",
      "status": "已上線",
      "type": "全站樣式",
      "check": "通過",
      "customers": 28,
      "updatedAt": "2026-08-12 12:10",
      "style": "專業藍綠",
      "html": "theme.json, tokens.css, preview.html, assets/",
      "owner": "張凱文"
    },
    {
      "id": "t-2",
      "category": "品牌樣式",
      "name": "品牌故事長頁版",
      "code": "STYLE-BRAND-009",
      "version": "v1.1.0",
      "status": "等待開通",
      "type": "品牌樣式",
      "check": "通過",
      "customers": 13,
      "updatedAt": "2026-08-11 17:40",
      "style": "溫暖敘事",
      "html": "theme.json, tokens.css, preview.html, assets/",
      "owner": "陳雅婷"
    },
    {
      "id": "t-3",
      "category": "品牌樣式",
      "name": "活動檔期促銷版",
      "code": "STYLE-CAMPAIGN-018",
      "version": "v0.8.7",
      "status": "檢查失敗",
      "type": "活動樣式",
      "check": "CSS 缺少必要檔案",
      "customers": 5,
      "updatedAt": "2026-08-13 10:02",
      "style": "高對比促銷",
      "html": "theme.json, tokens.css, preview.html, assets/",
      "owner": "張凱文"
    },
    {
      "id": "t-4",
      "category": "內容版型",
      "name": "服務入口｜卡片列表｜版型 A",
      "code": "BLOCK-SERVICE-CARD-A",
      "version": "v1.0.0",
      "status": "已上線",
      "type": "卡片列表",
      "check": "通過",
      "customers": 18,
      "updatedAt": "2026-08-13 11:20",
      "style": "沉浸情境面板｜4 張卡",
      "html": "schema.json, block.html, block.css, preview.png",
      "owner": "陳雅婷"
    },
    {
      "id": "t-5",
      "category": "內容版型",
      "name": "服務入口｜卡片列表｜版型 B",
      "code": "BLOCK-SERVICE-CARD-B",
      "version": "v1.0.0",
      "status": "內部測試",
      "type": "卡片列表",
      "check": "通過",
      "customers": 0,
      "updatedAt": "2026-08-13 11:35",
      "style": "錯落圖文卡片",
      "html": "schema.json, block.html, block.css, preview.png",
      "owner": "張凱文"
    },
    {
      "id": "t-6",
      "category": "內容版型",
      "name": "產品特色｜圖文交錯｜版型 A",
      "code": "BLOCK-FEATURE-MIX-A",
      "version": "v1.2.1",
      "status": "已上線",
      "type": "內容區塊",
      "check": "通過",
      "customers": 24,
      "updatedAt": "2026-08-09 15:25",
      "style": "左右交錯圖文",
      "html": "schema.json, block.html, block.css, preview.png",
      "owner": "陳雅婷"
    }
  ],
  "releases": [
    {
      "id": "r-1",
      "product": "E2B",
      "version": "v2.8.3",
      "item": "訂單同步錯誤修正",
      "scope": "全部客戶",
      "time": "2026-08-12 18:30",
      "user": "林怡君"
    },
    {
      "id": "r-2",
      "product": "官網方案",
      "version": "v1.6.0",
      "item": "HTML 檢查規則更新",
      "scope": "指定客戶測試",
      "time": "2026-08-13 09:00",
      "user": "張凱文"
    },
    {
      "id": "r-3",
      "product": "E2B",
      "version": "v2.8.0",
      "item": "Data Hub 欄位映射改善",
      "scope": "全部客戶",
      "time": "2026-08-05 14:00",
      "user": "王小明"
    },
    {
      "id": "r-4",
      "product": "官網方案",
      "version": "v1.5.4",
      "item": "品牌樣式與內容版型結構驗證",
      "scope": "內部測試",
      "time": "2026-08-01 11:20",
      "user": "陳雅婷"
    }
  ],
  "tasks": [
    {
      "id": "task-1",
      "title": "內容版型檢查失敗",
      "desc": "活動檔期促銷版缺少 css/main.css",
      "priority": "高",
      "target": "官網方案"
    },
    {
      "id": "task-2",
      "title": "客戶即將到期",
      "desc": "綠沐生活有限公司 16 天後到期",
      "priority": "中",
      "target": "客戶公司"
    },
    {
      "id": "task-3",
      "title": "功能維護中",
      "desc": "訂單同步目前暫停開關",
      "priority": "高",
      "target": "E2B"
    },
    {
      "id": "task-4",
      "title": "等待開通",
      "desc": "晨港物流股份有限公司等待開通 E2B",
      "priority": "中",
      "target": "產品使用權"
    },
    {
      "id": "task-5",
      "title": "付款逾期",
      "desc": "曜石工業付款逾期 7 天",
      "priority": "高",
      "target": "客戶公司"
    },
    {
      "id": "task-6",
      "title": "額度不足",
      "desc": "綠沐生活已使用 91% 官網發布額度",
      "priority": "中",
      "target": "使用量與額度"
    }
  ],
  "logs": [
    {
      "id": "l-1",
      "time": "2026-08-13 10:24",
      "user": "王小明",
      "action": "關閉 HTML 自動檢查功能",
      "target": "HTML_CHECK"
    },
    {
      "id": "l-2",
      "time": "2026-08-13 09:40",
      "user": "張凱文",
      "action": "更新官網方案維護公告",
      "target": "WEB_PLAN"
    },
    {
      "id": "l-3",
      "time": "2026-08-12 18:31",
      "user": "林怡君",
      "action": "發布 E2B v2.8.3",
      "target": "E2B"
    },
    {
      "id": "l-4",
      "time": "2026-08-12 15:10",
      "user": "陳雅婷",
      "action": "延長綠沐生活官網方案期限",
      "target": "C-1002"
    },
    {
      "id": "l-5",
      "time": "2026-08-11 16:42",
      "user": "王小明",
      "action": "新增內部帳號測試人員",
      "target": "IAM"
    }
  ]
};
