# DS總控台 專案資料夾分層規則

本專案採用根目錄分區管理，不使用單一 Outputs 資料夾平鋪所有檔案。

## 根目錄分層

```text
00_Project_Specs/
01_Product_Source_Data/
02_Working_Reports/
03_Outputs/
98_Temporary_Files/
99_Archive/
```

## 放置判斷

- 客戶或使用者提供的原始需求：放 `01_Product_Source_Data/`
- 分析、草稿、階段整理：放 `02_Working_Reports/`
- 正式可查看、可交付、可持續更新的前端成品：放 `03_Outputs/`
- 測試、暫存、可重建中間檔：放 `98_Temporary_Files/`
- 舊版或被替換但要保留的檔案：放 `99_Archive/`

## DS總控台目前分類

```text
01_Product_Source_Data/DS總控台/00_原始需求/
03_Outputs/01_UI畫面設計/00_最新版/
03_Outputs/01_UI畫面設計/01_設計討論文件/
03_Outputs/01_UI畫面設計/99_歷史版本/
```

不要把正式前端檔案長期平鋪在專案根目錄。

