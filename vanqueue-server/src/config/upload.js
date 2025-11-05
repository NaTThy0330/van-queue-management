const path = require('path');
const fs = require('fs');
const multer = require('multer');
const config = require('./env');

const UPLOAD_ROOT = path.isAbsolute(config.uploadDir)
  ? config.uploadDir
  : path.join(process.cwd(), config.uploadDir);
const SLIP_DIR = path.join(UPLOAD_ROOT, 'payment-slips');

if (!fs.existsSync(SLIP_DIR)) {
  fs.mkdirSync(SLIP_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, SLIP_DIR),
  filename: (_, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (_, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    cb(new Error('Only image files are allowed for payment slips'));
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 3 * 1024 * 1024, // 3MB
  },
  fileFilter,
});

module.exports = {
  upload,
  SLIP_DIR,
};
