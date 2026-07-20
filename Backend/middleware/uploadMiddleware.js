const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `${file.fieldname}-${basename}-${uniqueSuffix}${ext}`);
  }
});

// File Filter Validation
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  const allowedPdfTypes = ['application/pdf'];

  if (file.fieldname === 'presentationPDF') {
    if (allowedPdfTypes.includes(file.mimetype) || path.extname(file.originalname).toLowerCase() === '.pdf') {
      return cb(null, true);
    } else {
      return cb(new Error('Only PDF format is allowed for presentationPDF'), false);
    }
  }

  if (file.fieldname === 'projectLogo' || file.fieldname === 'screenshots') {
    if (allowedImageTypes.includes(file.mimetype)) {
      return cb(null, true);
    } else {
      return cb(new Error('Only image files (JPG, PNG, WEBP) are allowed for logo/screenshots'), false);
    }
  }

  cb(null, true);
};

// Multer Upload Instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB Max File Size
  }
});

// Middleware for submission multi-file fields
const uploadSubmissionFiles = upload.fields([
  { name: 'projectLogo', maxCount: 1 },
  { name: 'presentationPDF', maxCount: 1 },
  { name: 'screenshots', maxCount: 5 }
]);

module.exports = {
  upload,
  uploadSubmissionFiles
};
