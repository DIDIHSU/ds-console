import { products as seedProducts, features as seedFeatures, templates as seedTemplates, customers as seedCustomers, releases, tasks, logs as seedLogs, nav, statusMeta } from "./data.js";

const seedAccounts = [
  { id: "a-1", name: "王小明", email: "admin@demo.local", department: "系統管理", title: "最高管理員", scope: "全系統", product: true, customer: true, operation: true, system: true, status: "啟用", lastLogin: "2026-08-13 13:20" },
  { id: "a-2", name: "林怡君", email: "pm@demo.local", department: "產品營運", title: "產品負責人", scope: "E2B", product: true, customer: true, operation: true, system: false, status: "啟用", lastLogin: "2026-08-12 18:06" },
  { id: "a-3", name: "張凱文", email: "web@demo.local", department: "網站服務", title: "官網方案負責人", scope: "官網方案", product: true, customer: true, operation: false, system: false, status: "啟用", lastLogin: "2026-08-13 09:44" },
  { id: "a-4", name: "測試帳號", email: "viewer@demo.local", department: "測試", title: "檢視人員", scope: "唯讀", product: false, customer: false, operation: false, system: false, status: "停權", lastLogin: "2026-08-01 10:12" }
];

const state = {
  page: "dashboard",
  query: "",
  filter: "全部",
  products: structuredClone(seedProducts),
  features: structuredClone(seedFeatures),
  templates: structuredClone(seedTemplates),
  customers: structuredClone(seedCustomers),
  logs: structuredClone(seedLogs),
  accounts: structuredClone(seedAccounts),
  selectedProductId: seedProducts[0]?.id || "",
  selectedCustomerId: seedCustomers[0]?.id || "",
  selectedCustomerProduct: "",
  customerProductFilter: "全部產品",
  modal: null,
  drawer: null,
  toast: ""
};

const root = document.querySelector("#root");
const iconMap = {
  dashboard: "▦", products: "▣", features: "◇", templates: "▤", releases: "↗", customers: "▥",
  entitlements: "◇", expiring: "◷", trials: "✦", suspended: "⊘", usage: "▨", notifications: "◌",
  logs: "≡", accounts: "◎", settings: "⚙"
};

function render() {
  const title = pageTitle();
  root.innerHTML = `
    <div class="app">
      ${sidebar()}
      <main>
        <header class="topbar">
          <div><p class="eyebrow">DS 總控台</p><h1>${title}</h1></div>
          <div class="topActions">
            <div class="search"><span>⌕</span><input id="globalSearch" value="${escapeAttr(state.query)}" placeholder="搜尋產品、客戶、功能或樣式"></div>
            <button class="iconBtn" data-action="toast" data-message="目前有 6 件待處理事項">◌</button>
            <button class="primary" data-action="create">新增</button>
          </div>
        </header>
        ${page()}
      </main>
      ${modal()}
      ${drawer()}
      ${state.toast ? `<div class="toast">✓ ${state.toast}</div>` : ""}
    </div>`;
}

function sidebar() {
  return `<aside class="sidebar">
    <div class="brand"><div class="mark">DS</div><div><b>DS總控台</b><span>產品與客戶管理</span></div></div>
    <nav>${nav.map(([group, items]) => `<div class="navGroup"><p>${group}</p>${items.map(([label, key]) => `<button class="${isActiveNav(key) ? "active" : ""}" data-page="${key}"><span>${iconMap[key] || "·"}</span><span>${label}</span></button>`).join("")}</div>`).join("")}</nav>
    <div class="profile"><div class="avatar">王</div><div><b>王小明</b><span>系統管理員</span></div></div>
  </aside>`;
}

function page() {
  if (state.page === "dashboard") return dashboard();
  if (state.page === "guide") return guidePage();
  if (state.page === "products") return productsPage();
  if (state.page === "product-detail") return productDetail();
  if (state.page === "features") return featuresPage();
  if (state.page === "templates") return templatesPage();
  if (state.page === "releases") return releasesPage();
  if (state.page === "customers") return customersPage();
  if (state.page === "customer-detail") return customerDetail();
  if (state.page === "usage") return usagePage();
  if (state.page === "notifications") return notificationsPage();
  if (state.page === "logs") return logsPage(state.logs);
  if (state.page === "accounts") return accountsPage();
  if (state.page === "settings") return settingsPage();
  return dashboard();
}

function pageTitle() {
  if (state.page === "product-detail") {
    const product = state.products.find(p => p.id === state.selectedProductId);
    return product ? `${product.name} 管理` : "產品管理";
  }
  if (state.page === "customer-detail") {
    const customer = state.customers.find(c => c.id === state.selectedCustomerId);
    return customer ? `${customer.name} 詳情` : "客戶公司";
  }
  return nav.flatMap(group => group[1]).find(item => item[1] === state.page)?.[0] || "營運儀表板";
}

function isActiveNav(key) {
  return state.page === key || (key === "products" && state.page === "product-detail") || (key === "customers" && state.page === "customer-detail");
}

function dashboard() {
  const soon = state.customers.filter(c => c.daysLeft <= 30 && c.daysLeft >= 0).length;
  const activeEntitlements = 214;
  const highQuota = state.customers.filter(c => parseInt(c.quota) > 80).length;
  const openIssues = tasks.filter(t => t.priority === "高").length;
  const stats = [
    ["使用中權限", activeEntitlements, "+12 本週", "ok"],
    ["客戶公司", state.customers.length, `${soon} 間 30 天內到期`, soon ? "warn" : "ok"],
    ["維護中功能", state.features.filter(f => f.status === "維護中").length, `${openIssues} 件高優先處理`, openIssues ? "warn" : "ok"],
    ["額度風險", highQuota, "用量超過 80%", highQuota ? "bad" : "ok"]
  ];
  return `<div class="stack">
    <section class="kpiGrid">${stats.map(([label, value, hint, tone]) => `<div class="kpiCard"><span>${label}</span><strong>${value}</strong><small class="${tone}">${hint}</small></div>`).join("")}</section>
    <div class="dashboardGrid">
      ${panel("營運健康度", `<div class="healthList">${state.products.map(p => productHealthRow(p)).join("")}</div>`, "管理產品")}
      ${panel("待處理佇列", `<div class="taskList">${tasks.map(taskRow).join("")}</div>`, "查看全部")}
    </div>
    <div class="dashboardGrid">
      ${table("即將到期客戶", ["客戶公司", "產品", "到期日", "剩餘天數", "客戶狀態", "內部負責人", "操作"], state.customers.filter(c => c.daysLeft <= 30).map(c => [c.name, c.products, c.expiresAt, `${c.daysLeft} 天`, badge(c.status), c.owner, rowActions("customer", c.id, true)]))}
      ${table("最近發布紀錄", ["產品", "版本", "發布項目", "發布範圍", "發布時間", "發布人員"], releases.map(r => [r.product, r.version, r.item, r.scope, r.time, r.user]))}
    </div>
  </div>`;
}

function productHealthRow(product) {
  const featureCount = state.features.filter(f => f.product === product.name).length || 1;
  const activeFeatures = state.features.filter(f => f.product === product.name && f.enabled).length;
  const usage = Math.round((activeFeatures / featureCount) * 100);
  return `<button class="healthRow" data-action="openProduct" data-id="${product.id}">
    <div class="productIcon">${product.icon}</div>
    <div class="healthMain">
      <div><b>${product.name}</b>${badge(product.status)}</div>
      <span>${product.version} · ${product.customers} 間客戶 · ${activeFeatures}/${featureCount} 功能啟用</span>
      <div class="healthBar"><span style="width:${usage}%"></span></div>
    </div>
    <span class="rowChevron">管理</span>
  </button>`;
}

function taskRow(task) {
  const status = task.priority === "高" ? "維護中" : "即將到期";
  return `<div class="taskRow">
    ${badge(status)}
    <div><b>${task.title}</b><span>${task.desc}</span></div>
    <button class="secondary" data-action="toast" data-message="已開啟處理流程">處理</button>
  </div>`;
}

function productsPage() {
  if (!state.products.some(p => p.id === state.selectedProductId)) state.selectedProductId = state.products[0]?.id || "";
  const rows = filtered(state.products).map(p => [productName(p), p.code, p.owner, p.desc, p.version, badge(p.status), p.featureCount, p.customers, p.updatedAt, toggle(p.enabled, "toggleProduct", p.id), productActions(p.id)]);
  return `<div class="stack">${productFilters()}${table("產品列表", ["產品名稱", "產品代碼", "負責人", "產品說明", "目前版本", "產品狀態", "功能數量", "使用客戶數", "最近更新時間", "產品總開關", "操作"], rows)}</div>`;
}

function featuresPage() {
  const rows = filtered(state.features).map(f => [f.name, f.code, f.product, f.version, badge(f.status), f.scope, f.customers, toggle(f.enabled, "toggleFeature", f.id), f.updatedAt, rowActions("feature", f.id)]);
  return `<div class="stack">${tabs(["全部", "E2B", "官網方案", "已釋出", "維護中", "指定客戶測試"])}${table("功能管理", ["功能名稱", "功能代碼", "所屬產品", "功能版本", "功能狀態", "開放範圍", "開放客戶數", "功能總開關", "最近更新時間", "操作"], rows)}</div>`;
}

function templatesPage() {
  const rows = filtered(state.templates).map(t => [t.category, t.name, t.code, t.version, badge(t.status), t.type, t.style, t.check, t.customers, t.updatedAt, rowActions("template", t.id)]);
  return `<div class="stack">${tabs(["全部", "品牌樣式", "內容版型", "已上線", "等待開通", "檢查失敗"])}
    <div class="templateUploadGrid">
      ${uploadCard("品牌樣式", "上傳網站整體品牌風格、色票、字體、元件樣式與預覽檔。", "上傳品牌樣式")}
      ${uploadCard("內容版型", "上傳服務入口、卡片列表、圖文區塊等可被頁面組合使用的版型。", "上傳內容版型")}
    </div>
    ${table("官網樣式與內容版型列表", ["類別", "名稱", "代碼", "版本", "狀態", "版型類型", "呈現方式", "檢查結果", "使用客戶", "更新時間", "操作"], rows)}
  </div>`;
}

function releasesPage() {
  return `<div class="grid two">
    ${table("版本與發布", ["產品", "版本", "發布項目", "發布範圍", "發布時間", "發布人員"], releases.map(r => [r.product, r.version, r.item, r.scope, r.time, r.user]))}
    ${panel("發布檢查清單", ["功能測試通過", "指定客戶測試確認", "異動紀錄已建立", "通知內容已確認", "可回復版本已標記"].map((x, i) => `<label class="check"><input type="checkbox" ${i < 3 ? "checked" : ""}>${x}</label>`).join("") + `<button class="primary wide" data-action="toast" data-message="已建立模擬發布紀錄">建立模擬發布</button>`)}
  </div>`;
}

function customersPage() {
  let rows = customerRowsByFilter();
  if (state.customerProductFilter !== "全部產品") rows = rows.filter(c => c.products.includes(state.customerProductFilter));
  rows = rows.filter(c => JSON.stringify(c).includes(state.query));
  const productOptions = ["全部產品", ...state.products.map(p => p.name)];
  return `<div class="stack">
    <div class="filterBar multi">
      <div class="filterGroup">
        <label>客戶視角
          <select data-filter-select="customer-view">
            ${["全部", "產品使用權", "即將到期", "試用客戶", "暫停／終止客戶"].map(item => `<option value="${item}" ${state.filter === item ? "selected" : ""}>${item}</option>`).join("")}
          </select>
        </label>
        <label>購買產品
          <select data-filter-select="customer-product">
            ${productOptions.map(item => `<option value="${item}" ${state.customerProductFilter === item ? "selected" : ""}>${item}</option>`).join("")}
          </select>
        </label>
      </div>
      <div class="filterSummary">
        <span>目前顯示</span><b>${rows.length}</b><span>間客戶</span>
      </div>
    </div>
    ${table("客戶列表", ["客戶公司", "代碼", "開通產品數", "到期日", "剩餘", "狀態", "負責人", "額度", "操作"], rows.map(c => [c.name, c.code, `${customerProductCount(c)} 個產品`, c.expiresAt, `${c.daysLeft} 天`, badge(c.status), c.owner, c.quota, rowActions("customer", c.id, true)]))}
  </div>`;
}

function customerRowsByFilter() {
  if (state.filter === "即將到期") return state.customers.filter(c => c.daysLeft <= 30 && c.daysLeft >= 0);
  if (state.filter === "試用客戶") return state.customers.filter(c => c.status === "試用中");
  if (state.filter === "暫停／終止客戶") return state.customers.filter(c => ["停權", "已到期"].includes(c.status));
  return state.customers;
}

function customerProductCount(customer) {
  return state.products.filter(p => customer.products.includes(p.name)).length;
}

function usagePage() {
  return `<div class="grid two">
    ${panel("使用量與額度", state.customers.map(c => `<div class="quota"><div><b>${c.name}</b><span>${c.products}</span></div><meter min="0" max="100" value="${parseInt(c.quota)}"></meter>${badge(parseInt(c.quota) > 85 ? "即將到期" : "正常")}</div>`).join(""))}
    ${panel("額度調整", `<label>客戶公司<input value="綠沐生活有限公司"></label><label>增加發布額度<input value="20"></label><label>內部備註<textarea>客戶活動檔期需求，臨時提高額度。</textarea></label><button class="primary" data-action="toast" data-message="額度已模擬調整並留下紀錄">儲存調整</button>`)}
  </div>`;
}

function notificationsPage() {
  return `<div class="grid two">
    ${panel("通知規則", `<div class="settingsList">${["產品維護公告", "功能下架通知", "客戶即將到期提醒", "額度即將用完提醒", "HTML 檢查失敗通知"].map(x => settingRow(x, "Email、後台站內通知", toggle(true, "toast", "通知規則已切換"))).join("")}</div>`)}
    ${panel("撰寫通知", `<div class="formStack"><label>通知對象<input value="受影響客戶"></label><label>通知內容<textarea>您好，系統將於今日進行維護，期間部分功能可能暫停使用。</textarea></label><div class="formActions"><button class="ghost" data-action="toast" data-message="已儲存通知草稿">儲存草稿</button><button class="primary" data-action="toast" data-message="已建立模擬通知，不會真實寄送">建立通知</button></div></div>`)}
  </div>`;
}

function logsPage(rows = state.logs, title = "操作紀錄") {
  return table(title, ["操作時間", "操作人", "操作內容", "影響對象"], rows.map(l => [l.time, l.user, l.action, l.target]));
}

function accountsPage() {
  const rows = state.accounts.map(a => [staffCell(a), a.email, `${a.department}<br><span class="mutedText">${a.title}</span>`, a.scope, permissionSummary(a), badge(a.status), a.lastLogin, accountActions(a.id)]);
  return `<div class="stack">
    <div class="pageTools"><button class="primary" data-action="createAccount">新增管理帳號</button></div>
    ${table("職員帳號與權限", ["職員", "Email", "部門／職稱", "管理範圍", "可操作模組", "狀態", "最後登入", "操作"], rows)}
    ${panel("新增帳號流程", `<div class="processList"><div><b>1. 建立職員帳號</b><span>輸入姓名、Email、部門職稱與管理範圍。</span></div><div><b>2. 直接設定權限</b><span>在職員身上勾選可操作的產品、客戶、營運與系統模組。</span></div><div><b>3. 寄送啟用通知</b><span>系統寄送邀請信，職員首次登入後設定密碼。</span></div></div>`)}
  </div>`;
}

function settingsPage() {
  return `<div class="stack">
    <section class="summaryStrip">
      <div><span>安全基準</span><b>已啟用</b><small>雙因素驗證與敏感操作確認</small></div>
      <div><span>稽核保存</span><b>365 天</b><small>保留操作、通知與權限異動</small></div>
      <div><span>資料匯出</span><b>指定職員</b><small>由內部帳號直接控管匯出權限</small></div>
    </section>
    <section class="settingsPanel">
      <div class="settingsPanelHead"><div><h2>登入與操作安全</h2><span>控管管理員登入、閒置逾時與高風險操作。</span></div></div>
      <div class="settingsList">
        ${settingRow("管理員雙因素驗證", "所有最高管理員登入時必須完成第二步驗證。", toggle(true, "toast", "安全設定已切換"))}
        ${settingRow("閒置自動登出", "降低共用電腦或長時間未操作造成的帳號風險。", `<button class="secondary" data-action="toast" data-message="已開啟逾時設定">30 分鐘</button>`)}
        ${settingRow("敏感操作二次確認", "產品總開關、權限、期限異動需輸入原因並留下紀錄。", toggle(true, "toast", "安全設定已切換"))}
      </div>
    </section>
    <section class="settingsPanel">
      <div class="settingsPanelHead"><div><h2>資料與稽核</h2><span>管理資料留存、通知紀錄與匯出權限。</span></div></div>
      <div class="settingsList">
        ${settingRow("操作紀錄保存", "保存操作人、操作內容、影響對象與時間。", `<button class="secondary" data-action="toast" data-message="已開啟保存期間設定">365 天</button>`)}
        ${settingRow("通知寄送紀錄", "追蹤維護、到期、額度、品牌樣式與內容版型檢查通知。", toggle(true, "toast", "系統設定已切換"))}
        ${settingRow("匯出權限控管", "只有已開啟系統管理權限的職員可匯出客戶、權限與操作紀錄。", toggle(true, "toast", "系統設定已切換"))}
      </div>
    </section>
  </div>`;
}

function guidePage() {
  return `<div class="stack">
    ${panel("總控台操作流程", `<div class="flowDiagram">
      <div><b>營運儀表板</b><span>掌握風險、待辦與近期發布</span></div>
      <span>→</span>
      <div><b>產品管理</b><span>進入產品細節，管理功能、版本與客戶</span></div>
      <span>→</span>
      <div><b>客戶公司</b><span>用同一列表篩選權限、到期、試用與停權狀態</span></div>
      <span>→</span>
      <div><b>系統管理</b><span>維護職員帳號、個別權限與安全設定</span></div>
    </div>`)}
    ${panel("最高管理員使用重點", `<div class="guideText"><p><b>1. 每日先看儀表板。</b>確認維護中功能、到期客戶、額度風險和待處理佇列。</p><p><b>2. 產品相關工作從產品管理進入。</b>列表只做查找；按管理後進產品細節，再處理功能、版本、使用客戶或官網樣式與內容版型。</p><p><b>3. 客戶相關工作集中在客戶公司。</b>用客戶視角篩選產品使用權、即將到期、試用與暫停終止，不拆側邊欄頁面。</p><p><b>4. 權限異動走內部帳號。</b>建立職員帳號後，直接在該職員身上設定可操作模組，權限來源一眼就能確認。</p></div>`)}
  </div>`;
}

function customerDetail() {
  const customer = state.customers.find(c => c.id === state.selectedCustomerId) || state.customers[0];
  if (!customer) return "";
  const purchasedProducts = state.products.filter(p => customer.products.includes(p.name));
  if (!purchasedProducts.some(p => p.name === state.selectedCustomerProduct)) state.selectedCustomerProduct = purchasedProducts[0]?.name || "";
  const activeProduct = purchasedProducts.find(p => p.name === state.selectedCustomerProduct) || purchasedProducts[0];
  const applicationStatus = customer.status === "等待開通" ? "待審核" : customer.status === "試用中" ? "試用審核通過" : customer.status === "停權" ? "付款異常" : customer.daysLeft < 0 ? "已到期" : "已開通";
  const paymentStatus = customer.status === "停權" ? "逾期未付款" : customer.status === "等待開通" ? "待確認" : customer.daysLeft < 0 ? "已逾期" : "已付款";
  const productRows = purchasedProducts.map(p => [p.name, planName(customer, p), badge(productEntitlementStatus(customer)), customer.expiresAt, customer.quota, `<button class="secondary" data-action="openProduct" data-id="${p.id}">管理產品</button>`]);
  return `<div class="stack">
    <button class="backLink" data-page="customers">← 返回客戶列表</button>
    ${panel("客戶資訊", `<div class="customerHeader">
      <div><span>客戶公司</span><b>${customer.name}</b></div>
      <div><span>客戶代碼</span><b>${customer.code}</b></div>
      <div><span>聯絡人</span><b>${customer.contact}</b></div>
      <div><span>Email</span><b>${customer.email}</b></div>
      <div><span>內部負責人</span><b>${customer.owner}</b></div>
      <div><span>客戶狀態</span>${badge(customer.status)}</div>
    </div>`)}
    ${panel("申請與開通狀態", `<div class="flowSteps">
      ${flowStep("申請方案", "客戶選定產品與方案", "done")}
      ${flowStep("付款確認", paymentStatus, paymentStatus === "已付款" ? "done" : "warn")}
      ${flowStep("後台審核", applicationStatus, applicationStatus.includes("待") ? "warn" : "done")}
      ${flowStep("功能開通", `${purchasedProducts.length} 個產品`, customer.status === "使用中" || customer.status === "試用中" ? "done" : "warn")}
    </div>`)}
    ${table("購買產品與方案", ["產品", "方案", "開通狀態", "到期日", "額度使用", "操作"], productRows)}
    ${managementSection("功能開通清單", `${purchasedProducts.length} 個產品`, `<div class="productTabs">${purchasedProducts.map(p => `<button class="${p.name === state.selectedCustomerProduct ? "active" : ""}" data-action="selectCustomerProduct" data-product="${p.name}">${p.name}</button>`).join("")}</div>${activeProduct ? customerFeatureSection(customer, activeProduct) : `<div class="emptyState"><span>▥</span><span>此客戶尚未開通任何產品。</span></div>`}`)}
  </div>`;
}

function customerFeatureSection(customer, product) {
  const productFeatures = state.features.filter(f => f.product === product.name);
  const rows = productFeatures.map((f, index) => [f.name, f.code, planName(customer, product), badge(featureEntitlementStatus(customer, f, index)), f.scope, f.version, toggle(featureEnabledForCustomer(customer, f, index), "toast", "功能開通狀態已切換")]);
  return `<div class="subSection"><div class="sectionHead"><h3>${product.name}</h3><span>${planName(customer, product)}</span></div>${tableContent(["功能", "功能代碼", "方案", "開通狀態", "開放範圍", "版本", "開通"], rows)}</div>`;
}

function planName(customer, product) {
  if (product.name === "官網方案") return customer.template;
  if (customer.status === "試用中") return "試用方案";
  return "企業標準方案";
}

function productEntitlementStatus(customer) {
  if (customer.status === "等待開通") return "等待開通";
  if (customer.status === "停權") return "停權";
  if (customer.daysLeft < 0) return "已到期";
  if (customer.status === "試用中") return "試用中";
  return "使用中";
}

function featureEntitlementStatus(customer, feature, index) {
  if (customer.status === "等待開通") return "等待開通";
  if (["停權", "已到期"].includes(customer.status)) return customer.status;
  if (!featureEnabledForCustomer(customer, feature, index)) return "停權";
  return feature.status === "維護中" ? "維護中" : "已釋出";
}

function featureEnabledForCustomer(customer, feature, index) {
  if (["停權", "已到期", "等待開通"].includes(customer.status)) return false;
  if (customer.status === "試用中") return index < 2;
  return feature.enabled;
}

function flowStep(title, desc, tone) {
  return `<div class="flowStep ${tone}"><b>${title}</b><span>${desc}</span></div>`;
}

function productDetail() {
  const product = state.products.find(p => p.id === state.selectedProductId) || state.products[0];
  if (!product) return "";
  const productFeatures = state.features.filter(f => f.product === product.name);
  const productCustomers = state.customers.filter(c => c.products.includes(product.name));
  const productReleases = releases.filter(r => r.product === product.name);
  const featureRows = productFeatures.map(f => [f.name, f.code, f.version, badge(f.status), f.scope, f.customers, toggle(f.enabled, "toggleFeature", f.id), f.updatedAt, rowActions("feature", f.id)]);
  const releaseRows = productReleases.map(r => [r.version, r.item, r.scope, r.time, r.user]);
  const logRows = state.logs.filter(l => l.target === product.code || l.target === product.name).map(l => [l.time, l.user, l.action, l.target]);
  const brandRows = state.templates.filter(t => t.category === "品牌樣式").map(t => [t.name, t.code, t.version, badge(t.status), t.style, t.check, t.customers, t.updatedAt, rowActions("template", t.id)]);
  const contentTemplateRows = state.templates.filter(t => t.category === "內容版型").map(t => [t.name, t.code, t.version, badge(t.status), t.type, t.style, t.check, t.customers, t.updatedAt, rowActions("template", t.id)]);

  return `<div class="stack">
    <button class="backLink" data-page="products">← 返回產品列表</button>
    ${panel("產品資訊", `<div class="productHeader">
    <div class="productTitle"><div class="productIcon">${product.icon}</div><div><b>${product.name}</b><span>${product.desc}</span></div></div>
    <div class="productMeta"><span>產品代碼</span><b>${product.code}</b></div>
    <div class="productMeta"><span>負責人</span><b>${product.owner}</b></div>
    <div class="productMeta"><span>目前版本</span><b>${product.version}</b></div>
    <div class="productMeta"><span>產品狀態</span>${badge(product.status)}</div>
  </div>`)}
  <div class="managementStack">
    ${managementSection("功能管理", `${productFeatures.length} 個功能`, tableContent(["功能名稱", "功能代碼", "功能版本", "功能狀態", "開放範圍", "開放客戶數", "功能總開關", "最近更新時間", "操作"], featureRows))}
    ${managementSection("使用客戶", `${productCustomers.length} 間客戶`, `<div class="linkedSummary"><div><b>${productCustomers.length}</b><span>間客戶已購買或申請 ${product.name}</span></div><button class="secondary" data-action="viewProductCustomers" data-product="${product.name}">查看客戶公司</button></div>`)}
    ${managementSection("版本與發布", `${productReleases.length} 筆紀錄`, tableContent(["版本", "發布項目", "發布範圍", "發布時間", "發布人員"], releaseRows))}
    ${product.name === "官網方案" ? websiteAssetManagement(brandRows, contentTemplateRows) : ""}
    ${managementSection("異動紀錄", `${logRows.length} 筆紀錄`, logRows.length ? tableContent(["操作時間", "操作人", "操作內容", "影響對象"], logRows) : `<div class="emptyState"><span>≡</span><span>目前沒有 ${product.name} 的異動紀錄。</span></div>`)}
  </div></div>`;
}

function websiteAssetManagement(brandRows, contentTemplateRows) {
  return managementSection("官網樣式與內容版型", `${brandRows.length} 個品牌樣式 · ${contentTemplateRows.length} 個內容版型`, `
    <div class="templateUploadGrid">
      ${uploadCard("品牌樣式", "管理客戶網站的整體視覺風格，包含色彩、字體、元件樣式與預覽。", "上傳品牌樣式")}
      ${uploadCard("內容版型", "管理服務入口、卡片列表、圖文內容區塊等頁面可選用的呈現版型。", "上傳內容版型")}
    </div>
    <div class="subSection">
      <div class="sectionHead"><h3>品牌樣式</h3><span>原本的版型管理改為品牌樣式</span></div>
      ${tableContent(["樣式名稱", "樣式代碼", "版本", "狀態", "視覺方向", "檢查結果", "使用客戶", "更新時間", "操作"], brandRows)}
    </div>
    <div class="subSection">
      <div class="sectionHead"><h3>內容版型</h3><span>例如服務入口、卡片列表、版型 A/B</span></div>
      ${tableContent(["版型名稱", "版型代碼", "版本", "狀態", "類型", "呈現方式", "檢查結果", "使用客戶", "更新時間", "操作"], contentTemplateRows)}
    </div>`);
}

function uploadCard(title, desc, actionLabel) {
  return `<div class="uploadCard">
    <div><b>${title}</b><span>${desc}</span></div>
    <button class="secondary" data-action="toast" data-message="${actionLabel}任務已建立，等待檢查">${actionLabel}</button>
  </div>`;
}

function panel(title, body, action = "") {
  return `<section class="panel"><div class="panelHead"><h2>${title}</h2>${action ? `<button class="textBtn" data-page="products">${action}</button>` : ""}</div>${body}</section>`;
}

function table(title, columns, rows) {
  return panel(title, `<div class="tableWrap"><table><thead><tr>${columns.map(c => `<th>${c}</th>`).join("")}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`);
}

function tableContent(columns, rows) {
  return `<div class="tableWrap"><table><thead><tr>${columns.map(c => `<th>${c}</th>`).join("")}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}

function managementSection(title, meta, body) {
  return `<section class="managementSection"><div class="sectionHead"><h3>${title}</h3><span>${meta}</span></div>${body}</section>`;
}

function settingRow(title, desc, control) {
  return `<div class="setting"><div><b>${title}</b><span>${desc}</span></div><div class="settingControl">${control}</div></div>`;
}

function staffCell(account) {
  return `<div class="staffCell"><div class="avatar small">${account.name.slice(0, 1)}</div><div><b>${account.name}</b><span>${account.title}</span></div></div>`;
}

function permissionSummary(account) {
  const items = [
    ["產品", account.product],
    ["客戶", account.customer],
    ["營運", account.operation],
    ["系統", account.system]
  ].filter(([, enabled]) => enabled).map(([label]) => `<span>${label}</span>`);
  return `<div class="permissionTags">${items.length ? items.join("") : `<span class="muted">僅檢視</span>`}</div>`;
}

function accountActions(id) {
  return `<div class="rowActions"><button class="secondary" data-action="edit" data-type="account" data-id="${id}">編輯</button><button class="secondary" data-action="toast" data-message="已寄送重設密碼信">重設密碼</button></div>`;
}

function tabs(items) {
  return `<div class="filterBar">
    <label>篩選
      <select data-filter-select="general">
        ${items.map(item => `<option value="${item}" ${state.filter === item ? "selected" : ""}>${item}</option>`).join("")}
      </select>
    </label>
  </div>`;
}

function productFilters() {
  const statuses = ["全部", "已上線", "維護中", "停止服務", "已下架"];
  return `<div class="filterBar">
    <label>產品狀態
      <select data-filter-select="product-status">
        ${statuses.map(status => `<option value="${status}" ${state.filter === status ? "selected" : ""}>${status}</option>`).join("")}
      </select>
    </label>
  </div>`;
}

function badge(value) {
  const tone = statusMeta[value]?.[0] || "muted";
  return `<span class="badge ${tone}">${value}</span>`;
}

function toggle(checked, action, id) {
  return `<button class="toggle ${checked ? "on" : ""}" data-action="${action}" data-id="${id}" aria-label="總開關"><span></span></button>`;
}

function productName(p) {
  return `<div class="nameCell"><div class="productIcon">${p.icon}</div><b>${p.name}</b></div>`;
}

function rowActions(type, id, extend = false) {
  if (type === "customer") return `<div class="rowActions"><button class="secondary" data-action="openCustomer" data-id="${id}">查看</button><button class="secondary" data-action="edit" data-type="${type}" data-id="${id}">編輯</button>${extend ? `<button class="secondary" data-action="extend" data-id="${id}">延長期限</button>` : ""}</div>`;
  return `<div class="rowActions"><button class="secondary" data-action="edit" data-type="${type}" data-id="${id}">查看</button><button class="secondary" data-action="edit" data-type="${type}" data-id="${id}">編輯</button>${extend ? `<button class="secondary" data-action="extend" data-id="${id}">延長期限</button>` : ""}</div>`;
}

function productActions(id) {
  return `<div class="rowActions"><button class="secondary" data-action="openProduct" data-id="${id}">管理</button><button class="secondary" data-action="edit" data-type="product" data-id="${id}">編輯</button></div>`;
}

function filtered(items) {
  return items.filter(item => (state.filter === "全部" || Object.values(item).includes(state.filter) || item.product === state.filter || item.status === state.filter) && JSON.stringify(item).includes(state.query));
}

function modal() {
  if (!state.modal) return "";
  return `<div class="overlay">
    <section class="modal">
      <div class="modalHead"><div><p class="eyebrow">二次確認</p><h3>${state.modal.title}</h3></div><button class="iconBtn" data-action="closeModal">×</button></div>
      <div class="impactGrid"><div><b>${state.modal.customers}</b><span>影響客戶數</span></div><div><b>${state.modal.features}</b><span>影響功能數</span></div><div><b>${state.modal.target}</b><span>影響對象</span></div></div>
      <label>操作原因<textarea id="modalReason" placeholder="請填寫關閉或切換狀態原因"></textarea></label>
      <label>預計恢復時間<input id="modalRecovery" value="2026-08-13 18:00"></label>
      <label class="check"><input id="modalNotify" type="checkbox" checked>通知受影響客戶</label>
      <label class="check"><input id="modalConfirm" type="checkbox">我已確認影響範圍並留下操作紀錄</label>
      <div class="actions"><button class="ghost" data-action="closeModal">取消</button><button class="primary" data-action="confirmModal">確認執行</button></div>
    </section>
  </div>`;
}

function drawer() {
  if (!state.drawer) return "";
  const { type, item } = state.drawer;
  const fields = type === "customer"
    ? [["name", "客戶公司"], ["code", "客戶代碼"], ["contact", "聯絡人"], ["email", "Email"], ["products", "購買產品"], ["expiresAt", "到期日"], ["owner", "內部負責人"], ["note", "備註"]]
    : type === "product"
      ? [["name", "產品名稱"], ["code", "產品代碼"], ["desc", "產品說明"], ["version", "目前版本"], ["status", "產品狀態"], ["owner", "內部負責人"], ["notice", "維護公告"]]
      : type === "account"
        ? [["name", "姓名"], ["email", "Email"], ["department", "部門"], ["title", "職稱"], ["scope", "管理範圍"], ["status", "狀態"], ["lastLogin", "最後登入"]]
        : type === "template"
          ? [["category", "類別"], ["name", "名稱"], ["code", "代碼"], ["version", "版本"], ["status", "狀態"], ["type", "版型類型"], ["style", "呈現方式"], ["check", "檢查結果"], ["html", "檔案內容"], ["owner", "負責人"]]
        : [["name", "名稱"], ["code", "代碼"], ["version", "版本"], ["status", "狀態"], ["owner", "負責人"], ["desc", "說明"]];
  return `<div class="drawerWrap"><aside class="drawer">
    <div class="modalHead"><div><p class="eyebrow">${type === "customer" ? "客戶資料" : type === "product" ? "產品資料" : "資料設定"}</p><h3>${item.id?.startsWith("new") ? "新增" : "編輯"}${item.name ? `：${item.name}` : ""}</h3></div><button class="iconBtn" data-action="closeDrawer">×</button></div>
    <div class="formGrid">${fields.map(([key, label]) => `<label>${label}${key === "desc" || key === "notice" ? `<textarea data-field="${key}">${item[key] || ""}</textarea>` : `<input data-field="${key}" value="${escapeAttr(item[key] ?? "")}">`}</label>`).join("")}</div>
    ${type === "account" ? `<div class="permissionBlock"><b>職員可操作模組</b><div class="permissionChecks"><label class="check"><input data-field="product" type="checkbox" ${item.product ? "checked" : ""}>產品管理</label><label class="check"><input data-field="customer" type="checkbox" ${item.customer ? "checked" : ""}>客戶公司</label><label class="check"><input data-field="operation" type="checkbox" ${item.operation ? "checked" : ""}>營運管理</label><label class="check"><input data-field="system" type="checkbox" ${item.system ? "checked" : ""}>系統管理</label></div></div>` : `<label class="check"><input data-field="enabled" type="checkbox" ${item.enabled ?? true ? "checked" : ""}>是否啟用</label>`}
    <div class="actions"><button class="ghost" data-action="closeDrawer">取消</button><button class="primary" data-action="saveDrawer">儲存</button></div>
  </aside></div>`;
}

function openConfirm(kind, id) {
  const item = kind === "product" ? state.products.find(x => x.id === id) : state.features.find(x => x.id === id);
  state.modal = {
    kind, id, target: item.name, customers: item.customers, features: kind === "product" ? item.featureCount : 1,
    title: `${item.enabled ? "關閉" : "啟用"}${kind === "product" ? "產品總開關" : "功能總開關"}`
  };
  render();
}

function confirmModal() {
  const reason = document.querySelector("#modalReason")?.value.trim();
  const ok = document.querySelector("#modalConfirm")?.checked;
  if (!reason || !ok) return showToast("請填寫原因並勾選二次確認");
  const { kind, id } = state.modal;
  if (kind === "product") {
    const p = state.products.find(x => x.id === id);
    p.enabled = !p.enabled;
    p.status = p.enabled ? "已上線" : "停止服務";
    addLog(`${p.enabled ? "啟用" : "關閉"}產品總開關：${reason}`, p.code);
  } else {
    const f = state.features.find(x => x.id === id);
    f.enabled = !f.enabled;
    f.status = f.enabled ? "已釋出" : "維護中";
    addLog(`${f.enabled ? "啟用" : "關閉"}功能總開關：${reason}`, f.code);
  }
  state.modal = null;
  showToast("狀態已更新，操作紀錄已建立");
}

function edit(type, id) {
  const source = { product: state.products, customer: state.customers, feature: state.features, template: state.templates, account: state.accounts }[type];
  state.drawer = { type, item: structuredClone(source.find(x => x.id === id)) };
  render();
}

function saveDrawer() {
  const draft = structuredClone(state.drawer.item);
  document.querySelectorAll("[data-field]").forEach(el => {
    draft[el.dataset.field] = el.type === "checkbox" ? el.checked : el.value;
  });
  const key = state.drawer.type === "customer" ? "customers" : state.drawer.type === "product" ? "products" : state.drawer.type === "template" ? "templates" : state.drawer.type === "account" ? "accounts" : "features";
  if (draft.id?.startsWith("new")) draft.id = `${state.drawer.type}-${Date.now()}`;
  state[key] = state[key].some(x => x.id === draft.id) ? state[key].map(x => x.id === draft.id ? draft : x) : [draft, ...state[key]];
  addLog("儲存資料", draft.code || draft.name);
  state.drawer = null;
  showToast("資料已儲存");
}

function createItem() {
  const type = state.page === "customers" ? "customer" : state.page === "accounts" ? "account" : state.page === "features" ? "feature" : state.page === "templates" ? "template" : state.page === "product-detail" ? "feature" : "product";
  state.drawer = { type, item: { id: `new-${type}`, name: "", code: "", version: "v1.0.0", status: "開發中", enabled: true, owner: "王小明", desc: "" } };
  render();
}

function createAccount() {
  state.drawer = { type: "account", item: { id: "new-account", name: "", email: "", department: "", title: "", scope: "依職務設定", product: false, customer: false, operation: false, system: false, status: "啟用", lastLogin: "尚未登入" } };
  render();
}

function extendCustomer(id) {
  const c = state.customers.find(x => x.id === id);
  c.expiresAt = "2026-11-30";
  c.daysLeft = 109;
  c.status = "使用中";
  addLog("延長客戶使用期限", c.code);
  showToast(`${c.name} 已延長至 2026-11-30`);
}

function addLog(action, target) {
  state.logs.unshift({ id: `l-${Date.now()}`, time: "2026-08-13 14:20", user: "王小明", action, target });
}

function showToast(message) {
  state.toast = message;
  render();
  setTimeout(() => { state.toast = ""; render(); }, 2200);
}

function escapeAttr(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
}

root.addEventListener("input", event => {
  if (event.target.id === "globalSearch") {
    state.query = event.target.value;
    render();
    document.querySelector("#globalSearch")?.focus();
  }
});

root.addEventListener("change", event => {
  if (event.target.dataset.filterSelect === "customer-product") {
    state.customerProductFilter = event.target.value;
    render();
    return;
  }
  if (event.target.dataset.filterSelect) {
    state.filter = event.target.value;
    render();
  }
});

root.addEventListener("click", event => {
  const el = event.target.closest("button");
  if (!el) return;
  if (el.dataset.page) {
    state.page = el.dataset.page;
    state.filter = "全部";
    if (el.dataset.page === "customers") state.customerProductFilter = "全部產品";
    render();
  }
  if (el.dataset.filter) { state.filter = el.dataset.filter; render(); }
  if (el.dataset.action === "toggleProduct") openConfirm("product", el.dataset.id);
  if (el.dataset.action === "toggleFeature") openConfirm("feature", el.dataset.id);
  if (el.dataset.action === "closeModal") { state.modal = null; render(); }
  if (el.dataset.action === "confirmModal") confirmModal();
  if (el.dataset.action === "edit") edit(el.dataset.type, el.dataset.id);
  if (el.dataset.action === "closeDrawer") { state.drawer = null; render(); }
  if (el.dataset.action === "saveDrawer") saveDrawer();
  if (el.dataset.action === "create") createItem();
  if (el.dataset.action === "createAccount") createAccount();
  if (el.dataset.action === "extend") extendCustomer(el.dataset.id);
  if (el.dataset.action === "toast") showToast(el.dataset.message || "操作已完成");
  if (el.dataset.action === "openProduct") {
    state.selectedProductId = el.dataset.id;
    state.page = "product-detail";
    render();
  }
  if (el.dataset.action === "openCustomer") {
    state.selectedCustomerId = el.dataset.id;
    state.selectedCustomerProduct = "";
    state.page = "customer-detail";
    render();
  }
  if (el.dataset.action === "selectCustomerProduct") {
    state.selectedCustomerProduct = el.dataset.product;
    render();
  }
  if (el.dataset.action === "viewProductCustomers") {
    state.customerProductFilter = el.dataset.product;
    state.filter = "全部";
    state.page = "customers";
    render();
  }
});

render();
