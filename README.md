# salmon-shopping-website

這是一個使用 Next.js 開發的購物網站專案。

## 主要功能

### 首頁

使用者可以在首頁上查看目前所有的商品。  
每個商品都附有詳細資訊，包括商品圖片、名稱、描述和價格。  
提供搜尋功能，使用者可以根據以下條件進行商品搜尋：  
價格：使用者可以輸入最低價格和最高價格，以範圍搜尋商品。  
賣家名稱：使用者可以輸入賣家名稱，以尋找特定賣家的商品。
![Cat GIF](/demo/searchProduct.gif)

### 買家

將喜歡的商品加入購物車。  
查看購物車內的商品列表和總金額。  
![Cat GIF](/demo/cart.gif)
確認訂單後，可以將訂單送出、查看訂單資訊。  
送出訂單後，賣家將收到該訂單的相關資訊，包括買家資訊、訂單內容和金額。
![Cat GIF](/demo/BuyerOrder.gif)

### 賣家

新增商品：賣家可以新增商品，包括商品圖片、名稱、描述和價格等資訊。  
![Cat GIF](/demo/createProduct.gif)
編輯商品：賣家可以編輯現有的商品資訊，包括商品圖片、名稱、描述和價格。  
![Cat GIF](/demo/editProduct.gif)
訂單系統：賣家可以查看接收到的訂單列表，包括買家資訊、訂單內容和金額。
![Cat GIF](/demo/order.gif)

## 技術細節

### 前端

React：將畫面拆分成多個組件並且重複使用，使程式碼更簡潔也更易於維護。此外，每個請求不需要重新整理整個頁面，以 SPA 的方式提升渲染頁面的效率。  
Next.js：基於 React 的框架，支援 SSR 和 SSG 功能，比起 React 能更輕鬆實現這兩種渲染方式，也提升了 SEO 與使用者體驗。  
響應式設計（RWD）：確保網站在不同設備和螢幕大小下都能提供良好的使用者體驗。這使得網站能夠適應不同的瀏覽器和設備，提供一致且美觀的使用者界面。  
API 串接：與自行架設的後端 API 進行數據交換。能夠自由設計和管理 API ，以滿足專案不同的需求。

### 後端

Node.js：可以在伺服器運行 JavaScript、開發 API 等後端需求，並且擁有龐大的生態系統，提供了許多套件管理工具，方便開發時依照專案需求選擇合適的套件使用與整合。  
Express 框架： Express 提供 Route、Middleware 等諸多工具，可以快速搭建後端伺服器。  
符合 MVC 架構：模型（Model）、視圖（View）、控制器（Controller）的分離設計，方便程式碼的維護以及擴展。  
符合 RESTful API 的設計原則，使用 URL 路徑和 HTTP 方法。使 API 的設計和使用具有一致性並且易於理解，

### 資料庫

MongoDB（ NoSQL 非關連式資料庫 ），相較於傳統的關聯式資料庫，NoSQL 有以下優點：  
靈活的資料模型、可擴展性和高性能、易開發和維護以及彈性的可用性和故障恢復。
Node.js、MongoDB 透過 Mongoose 將 JavaScript 中的 Object 轉換成 MongoDB 中的 Document，利於開發時與資料庫的互動。

### 登入系統

bcrypt 加密：為了保護用戶密碼的安全性，使用 bcrypt 進行密碼的加密與驗證。  
Passport.js、JWT：使用 Passport.js 提供的 JWT 進行身份驗證。使用者在登入後，將獲得一個 JWT Token，並且在後續的請求中通過 Token 進行身份驗證，確保用戶的所有請求皆須通過驗證。
