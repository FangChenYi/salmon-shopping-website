const multer = require("multer");

// 設定 Multer 儲存的目標路徑和檔案名稱
const storage = multer.memoryStorage();

// 檢查是否為圖片格式
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    cb(null, false);
  } else {
    cb(null, true);
  }
};

// 設定 Multer 上傳檔案的限制條件，包括存儲目標和檔案過濾器
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB
  },
});

module.exports = upload;
