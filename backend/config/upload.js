/**
 * Multer Upload Configuration
 * Location: backend/config/upload.js
 * Purpose: Configure file upload middleware for hair photos
 */
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const projectRoot = path.join(__dirname, '..', '..');
const uploadDir = path.join(projectRoot, 'uploads');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const filename = `hair-${req.user.userId}-${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  // Keep env overrides, but always include routine-supported video/image extensions
  // so routine media uploads do not break when ALLOWED_FILE_TYPES is image-only.
  const configured = String(process.env.ALLOWED_FILE_TYPES || '')
    .split(',')
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean);
  const defaults = ['jpeg', 'jpg', 'png', 'gif', 'webp', 'mp4', 'webm', 'mov'];
  const allowedTypes = Array.from(new Set([...(configured.length ? configured : defaults), ...defaults]));
  const ext = path.extname(file.originalname).slice(1).toLowerCase();

  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Only ${allowedTypes.join(', ')} files are allowed`), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 25 * 1024 * 1024, // 25MB default
  },
  fileFilter,
});

// Profile photo: store in uploads/profiles/
const profilesDir = path.join(uploadDir, 'profiles');
if (!fs.existsSync(profilesDir)) fs.mkdirSync(profilesDir, { recursive: true });
const profilePhotoStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, profilesDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `profile-${req.user.userId}-${uuidv4()}${ext}`);
  },
});
const uploadProfilePhoto = multer({
  storage: profilePhotoStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

// Credential docs: uploads/credentials/, allow PDF and images
const credentialsDir = path.join(uploadDir, 'credentials');
if (!fs.existsSync(credentialsDir)) fs.mkdirSync(credentialsDir, { recursive: true });
const docFilter = (req, file, cb) => {
  const allowed = ['pdf', 'jpeg', 'jpg', 'png', 'gif', 'webp'];
  const allowedMime = new Set([
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ]);
  const ext = path.extname(file.originalname).slice(1).toLowerCase();
  const mime = String(file.mimetype || '').toLowerCase();
  if (!allowedMime.has(mime)) {
    cb(new Error('Unsupported file MIME type for ID verification'), false);
    return;
  }
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error('Only PDF and image files are allowed'), false);
};
const credentialStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, credentialsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.pdf';
    cb(null, `cred-${req.user.userId}-${uuidv4()}${ext}`);
  },
});
const uploadCredentialDocs = multer({
  storage: credentialStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: docFilter,
}).array('documents', 10);

// Consultation chat images: uploads/consultation-chat/
const consultChatDir = path.join(uploadDir, 'consultation-chat');
if (!fs.existsSync(consultChatDir)) fs.mkdirSync(consultChatDir, { recursive: true });
const consultChatFilter = (req, file, cb) => {
  const allowed = ['jpeg', 'jpg', 'png', 'gif', 'webp', 'heic', 'heif'];
  const ext = path.extname(file.originalname).slice(1).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error('Only image files are allowed for chat'), false);
};
const consultChatStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, consultChatDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `consult-${req.user.userId}-${uuidv4()}${ext}`);
  },
});
const uploadConsultationMessage = multer({
  storage: consultChatStorage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: consultChatFilter,
});

const consultPaymentDir = path.join(uploadDir, 'consultation-payments');
if (!fs.existsSync(consultPaymentDir)) fs.mkdirSync(consultPaymentDir, { recursive: true });
const consultPaymentStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, consultPaymentDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `pay-${req.user.userId}-${uuidv4()}${ext}`);
  },
});
const uploadConsultationPaymentReceipt = multer({
  storage: consultPaymentStorage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: consultChatFilter,
});

module.exports = upload;
module.exports.uploadProfilePhoto = uploadProfilePhoto;
module.exports.uploadCredentialDocs = uploadCredentialDocs;
module.exports.uploadConsultationMessage = uploadConsultationMessage;
module.exports.uploadConsultationPaymentReceipt = uploadConsultationPaymentReceipt;
module.exports.uploadDir = uploadDir;
module.exports.profilesDir = profilesDir;
module.exports.credentialsDir = credentialsDir;
module.exports.consultChatDir = consultChatDir;
module.exports.consultPaymentDir = consultPaymentDir;
