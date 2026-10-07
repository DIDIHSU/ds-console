# DS總控台 專案總覽

本專案用於「公司產品與客戶管理總後台」前端 Demo 的長期討論、需求確認、流程展示與版本更新。

## 跨電腦接續

GitHub 儲存庫：https://github.com/DIDIHSU/ds-console

另一台電腦接手時，先閱讀 [進度與跨電腦交接](02_Working_Reports/2026-10-06_跨電腦交接.md)，其中包含已完成內容、待確認需求、啟動方式與同步步驟。

最新進度（2026-10-07）：[Dashboard 雙視角與公司總覽](03_Outputs/01_UI畫面設計/01_設計討論文件/2026-10-07_Dashboard雙視角與公司總覽.md)。Dashboard 新增產品／客戶視角；客戶公司清單簡化為公司摘要，產品帳號與服務細節在公司詳細頁管理。

## 資料夾結構

```text
00_Project_Specs/        專案規格、資料夾規則、更新流程
01_Product_Source_Data/  原始需求與來源資料
02_Working_Reports/      討論草稿、分析過程與階段整理
03_Outputs/              正式可查看或交付的輸出
98_Temporary_Files/      暫存、測試與可重建中間檔
99_Archive/              舊版封存
```

## 最新前端 Demo

線上操作：[DS總控台最新 UI](https://didihsu.github.io/ds-console/)。

GitHub Actions 會在 `main` 分支的最新版程式更新後，重新建置、檢查並發布 Demo。Pages 僅發布網頁、樣式及程式 bundle；需求文件、進度與歷史版本仍完整保留在儲存庫，可透過 clone 下載。發布狀態可在 GitHub 的 Actions → Publish latest UI to Pages 查看。

最新版固定位置：

```text
03_Outputs/01_UI畫面設計/00_最新版/DS總控台畫面設計/
03_Outputs/01_UI畫面設計/00_最新版/DS總控台畫面設計.zip
```

可直接查看：

```text
03_Outputs/01_UI畫面設計/00_最新版/DS總控台畫面設計/index.html
```

若要啟動本機服務：

```bash
cd 03_Outputs/01_UI畫面設計/00_最新版/DS總控台畫面設計
npm start
```
